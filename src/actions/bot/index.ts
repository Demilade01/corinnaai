"use server";

import { db } from "@/lib/db";
import { extractEmailsFromString, extractURLfromString } from "@/lib/utils";
import { onRealTimeChat } from "../conversation";
import { clerkClient } from "@clerk/nextjs";
import { onMailer } from "../mailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ORIGIN } from "@/config/origin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const onStoreConversations = async (
  id: string,
  message: string,
  role: "assistant" | "user"
) => {
  await db.chatRoom.update({
    where: {
      id,
    },
    data: {
      message: {
        create: {
          message,
          role,
        },
      },
    },
  });

  console.log("Stored conversation");
};

export const onGetCurrentChatBot = async (id: string) => {
  try {
    const chatbot = await db.domain.findUnique({
      where: {
        id,
      },
      select: {
        helpdesk: true,
        name: true,
        chatBot: {
          select: {
            id: true,
            welcomeMessage: true,
            icon: true,
            textColor: true,
            background: true,
            helpdesk: true,
          },
        },
      },
    });

    if (chatbot) {
      return chatbot;
    }
  } catch (error) {
    console.log(error);
  }
};

let customerEmail: string | undefined;

export const onAiChatBotAssistant = async (
  id: string,
  chat: { role: "assistant" | "user"; content: string }[],
  author: "user",
  message: string
) => {
  try {
    // Fetch the chatbot domain and its filter questions
    const chatBotDomain = await db.domain.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        filterQuestions: {
          where: {
            answered: null,
          },
          select: {
            question: true,
          },
        },
      },
    });

    if (chatBotDomain) {
      // Extract email from the message
      const extractedEmail = extractEmailsFromString(message);
      if (extractedEmail) {
        customerEmail = extractedEmail[0];
      }

      if (customerEmail) {
        // Check if the customer exists in the database
        const checkCustomer = await db.domain.findUnique({
          where: {
            id,
          },
          select: {
            User: {
              select: {
                clerkId: true,
              },
            },
            name: true,
            customer: {
              where: {
                email: {
                  startsWith: customerEmail,
                },
              },
              select: {
                id: true,
                email: true,
                questions: true,
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                    mailed: true,
                  },
                },
              },
            },
          },
        });

        // If customer does not exist, create a new customer
        if (checkCustomer && !checkCustomer.customer.length) {
          const newCustomer = await db.domain.update({
            where: {
              id,
            },
            data: {
              customer: {
                create: {
                  email: customerEmail,
                  questions: {
                    create: chatBotDomain.filterQuestions,
                  },
                  chatRoom: {
                    create: {},
                  },
                },
              },
            },
          });
          if (newCustomer) {
            console.log("new customer made");
            const response = {
              role: "assistant",
              content: `Welcome aboard ${
                customerEmail.split("@")[0]
              }! I'm glad to connect with you. Is there anything you need help with?`,
            };
            return { response };
          }
        }

        // If customer exists and chat room is live
        if (checkCustomer && checkCustomer.customer[0].chatRoom[0].live) {
          await onStoreConversations(
            checkCustomer?.customer[0].chatRoom[0].id!,
            message,
            author
          );

          onRealTimeChat(
            checkCustomer.customer[0].chatRoom[0].id,
            message,
            "user",
            author
          );

          // If the chat room has not been mailed, send an email
          if (!checkCustomer.customer[0].chatRoom[0].mailed) {
            const user = await clerkClient.users.getUser(
              checkCustomer.User?.clerkId!
            );

            onMailer(user.emailAddresses[0].emailAddress);

            // Update mail status to prevent spamming
            const mailed = await db.chatRoom.update({
              where: {
                id: checkCustomer.customer[0].chatRoom[0].id,
              },
              data: {
                mailed: true,
              },
            });

            if (mailed) {
              return {
                live: true,
                chatRoom: checkCustomer.customer[0].chatRoom[0].id,
              };
            }
          }
          return {
            live: true,
            chatRoom: checkCustomer.customer[0].chatRoom[0].id,
          };
        }

        await onStoreConversations(
          checkCustomer?.customer[0].chatRoom[0].id!,
          message,
          author
        );

        // Start a new AI chat session
        const aiChat = await model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `
              You will get an array of questions that you must ask the customer.

              Progress the conversation using those questions.

              Whenever you ask a question from the array i need you to add a keyword at the end of the question (complete) this keyword is extremely important.

              Do not forget it.

              only add this keyword when your asking a question from the array of questions. No other question satisfies this condition

              Always maintain character and stay respectfull.

              The array of questions : [${chatBotDomain.filterQuestions
                .map((questions) => questions.question)
                .join(", ")}]

              if the customer says something out of context or inapporpriate. Simply say this is beyond you and you will get a real user to continue the conversation. And add a keyword (realtime) at the end.

              if the customer agrees to book an appointment send them this link ${ORIGIN}/portal/${id}/appointment/${
                    checkCustomer?.customer[0].id
                  }

              if the customer wants to buy a product redirect them to the payment page ${ORIGIN}/portal/${id}/payment/${
                    checkCustomer?.customer[0].id
                  }
          `,
                },
              ],
            },
            ...chat.map((chat) => {
              return {
                role: chat.role === "assistant" ? "model" : chat.role,
                parts: [
                  {
                    text: chat.content,
                  },
                ],
              };
            }),
          ],
        });

        const chatCompletion = await aiChat.sendMessage(message);

        // If the AI chat response includes "(realtime)", update the chat room to live
        if (chatCompletion.response.text()?.includes("(realtime)")) {
          const realtime = await db.chatRoom.update({
            where: {
              id: checkCustomer?.customer[0].chatRoom[0].id,
            },
            data: {
              live: true,
            },
          });

          if (realtime) {
            const response = {
              role: "assistant",
              content: chatCompletion.response.text().replace("(realtime)", ""),
            };

            await onStoreConversations(
              checkCustomer?.customer[0].chatRoom[0].id!,
              response.content,
              "assistant"
            );

            return { response };
          }
        }

        // If the last chat message includes "(complete)", update the first unanswered question
        if (chat[chat.length - 1].content.includes("(complete)")) {
          const firstUnansweredQuestion = await db.customerResponses.findFirst({
            where: {
              customerId: checkCustomer?.customer[0].id,
              answered: null,
            },
            select: {
              id: true,
            },
            orderBy: {
              question: "asc",
            },
          });
          if (firstUnansweredQuestion) {
            await db.customerResponses.update({
              where: {
                id: firstUnansweredQuestion.id,
              },
              data: {
                answered: message,
              },
            });
          }
        }

        // If the AI chat response includes a link, extract and return it
        if (chatCompletion) {
          const generatedLink = extractURLfromString(
            chatCompletion.response.text()
          );

          if (generatedLink) {
            const link = generatedLink[0];
            const response = {
              role: "assistant",
              content: `Great! you can follow the link to proceed`,
              link: link.slice(0, -1),
            };

            await onStoreConversations(
              checkCustomer?.customer[0].chatRoom[0].id!,
              `${response.content} ${response.link}`,
              "assistant"
            );

            return { response };
          }

          const response = {
            role: "assistant",
            content: chatCompletion.response.text(),
          };

          await onStoreConversations(
            checkCustomer?.customer[0].chatRoom[0].id!,
            `${response.content}`,
            "assistant"
          );

          return { response };
        }
      }

      // If no customer is found, start a new AI chat session
      console.log("No customer");
      const aiChat = await model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `
            You are a highly knowledgeable and experienced sales representative for a ${chatBotDomain.name} that offers a valuable product or service. Your goal is to have a natural, human-like conversation with the customer in order to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or redirect them to a link if they havent provided all relevant information.
            Right now you are talking to a customer for the first time. Start by giving them a warm welcome on behalf of ${chatBotDomain.name} and make them feel welcomed.

            Your next task is lead the conversation naturally to get the customers email address. Be respectful and never break character

          `,
              },
            ],
          },
          ...chat.map((chat) => {
            return {
              role: chat.role === "assistant" ? "model" : chat.role,
              parts: [
                {
                  text: chat.content,
                },
              ],
            };
          }),
        ],
      });

      const chatCompletion = await aiChat.sendMessage(message);

      if (chatCompletion) {
        const response = {
          role: "assistant",
          content: chatCompletion.response.text(),
        };

        return { response };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
