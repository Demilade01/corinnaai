import { ChatBotMessageProps } from "@/schemas/conversation.schema";
import React, { forwardRef, useEffect } from "react";
import { UseFormRegister } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RealTimeMode from "./real-time";
import Image from "next/image";
import TabsMenu from "../tabs";
import { BOT_TABS_MENU } from "@/constants/menu";
import ChatIcon from "@/icons/chat-icon";
import { TabsContent } from "../ui/tabs";
import { Separator } from "../ui/separator";
import Bubble from "./bubble";
import { Responding } from "./responding";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { Paperclip, Send } from "lucide-react";
import { Label } from "../ui/label";
import { CardDescription, CardTitle } from "../ui/card";
import Accordion from "../accordian";
import UploadButton from "../upload-button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  errors: any;
  register: UseFormRegister<ChatBotMessageProps>;
  chats: { role: "assistant" | "user"; content: string; link?: string }[];
  onChat(): void;
  onResponding: boolean;
  domainName: string;
  theme?: string | null;
  textColor?: string | null;
  help?: boolean;
  realtimeMode:
  | {
    chatroom: string;
    mode: boolean;
  }
  | undefined;
  helpdesk: {
    id: string;
    question: string;
    answer: string;
    domainId: string | null;
  }[];
  setChat: React.Dispatch<
    React.SetStateAction<
      {
        role: "user" | "assistant";
        content: string;
        link?: string | undefined;
      }[]
    >
  >;
  className?: string;
};

export const BotWindow = forwardRef<HTMLDivElement, Props>(
  (
    {
      errors,
      register,
      chats,
      onChat,
      onResponding,
      domainName,
      helpdesk,
      realtimeMode,
      setChat,
      textColor,
      theme,
      help,
      className,
    },
    ref
  ) => {
    console.log(errors);

    console.log(chats)

    return (
      <div className={cn("w-full h-full relative flex flex-col bg-background rounded-xl border-[1px] overflow-hidden", className)}>
        <div className="flex justify-between px-4 pt-4">
          <div className="flex gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-start flex-col">
              <h3 className="text-lg font-bold leading-none">
                Sales Representative
              </h3>
              <p className="text-sm">{domainName.split(".com")[0]}</p>
              {realtimeMode?.mode && (
                <RealTimeMode
                  setChats={setChat}
                  chatRoomId={realtimeMode.chatroom}
                />
              )}
            </div>
          </div>
          <div className="relative w-16 h-16">
            <Image
              src="https://ucarecdn.com/019dd17d-b69b-4dea-a16b-60e0f25de1e9/propuser.png"
              fill
              alt="users"
              objectFit="contain"
            />
          </div>
        </div>
        <TabsMenu
          triggers={BOT_TABS_MENU}
          className="bg-transparent border-[1px] border-border m-2"
          TabsTriggerClassName="data-[state=active]:bg-secondary data-[state=active]:text-muted-foreground"
        >
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <div className="flex flex-col h-full">
              <ScrollArea
                style={{
                  background: theme || "",
                  color: textColor || "",
                }}
                className="flex-grow px-3 py-5 gap-3 [&_*+*]:mt-2 h-[60vh]"
                ref={ref}
              >
                {chats.map((chat, key) => (
                  <>
                    <Bubble key={key} message={chat} />
                  </>
                ))}
                {onResponding && <Responding />}
              </ScrollArea>

              <div className="bg-background absolute bottom-0 left-0 right-0 py-4">
                <form
                  onSubmit={onChat}
                  className="flex gap-1 px-3 py-1 flex-col flex-1"
                >
                  <div className="flex justify-between items-center gap-1">
                    <Label
                      className={buttonVariants({
                        size: "icon",
                        className: "cursor-pointer",
                      })}
                      htmlFor="bot-image"
                    >
                      <Paperclip />
                      <Input
                        {...register("image")}
                        type="file"
                        id="bot-image"
                        className="hidden"
                      />
                    </Label>
                    <Input
                      {...register("content")}
                      placeholder="Type your message..."
                      className="focus-visible:ring-0 flex-1 px-4 py-1 focus-visible:ring-offset-0 bg-porcelain text-gray-900 dark:text-white placeholder:text-gray-900 placeholder:dark:text-white rounded-sm outline-none border-none"
                    />
                    <Button size="icon" type="submit">
                      <Send />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="helpdesk">
            <div className="h-[485px] overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4">
              <div>
                <CardTitle>Help Desk</CardTitle>
                <CardDescription>
                  Browse from a list of questions people usually ask.
                </CardDescription>
              </div>
              <Separator orientation="horizontal" />

              {helpdesk.map((desk) => (
                <Accordion
                  key={desk.id}
                  trigger={desk.question}
                  content={desk.answer}
                />
              ))}
            </div>
          </TabsContent>
        </TabsMenu>
      </div>
    );
  }
);

BotWindow.displayName = "BotWindow";
