import IframeChat from "@/components/iframe/iframeChat";
import NavBar from "@/components/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/constants/landing-page";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="pb-8">
      <NavBar />
      <section>
        <div className="flex items-center justify-center flex-col mt-[80px] gap-4">
          <span className="text-orange bg-orange/20 px-4 py-2 rounded-full text-sm">
            An AI powered sales assistant chatbot
          </span>
          <Image
            src="/images/corinna-ai-logo.png"
            alt="CORINNA AI"
            width={500}
            height={100}
            className="max-w-lg object-contain"
          />
          <p className="text-center max-w-[500px]">
            Your AI powered sales assistant Embed Corinna AI into any website
            with just a snippet of code!
          </p>
          <Link
            href="/auth/sign-in"
            className={buttonVariants({
              className:
                "!bg-orange hover:!bg-orange/90 font-bold text-white px-4",
            })}
          >
            Start For Free
          </Link>
          <Image
            src="/images/iphonecorinna.png"
            width={400}
            height={100}
            alt="Demo"
            className="max-w-lg object-contain"
          />
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 mt-10">
        <h2 className="text-4xl text-center"> Choose what fits you right</h2>
        <p className="text-muted-foreground text-center max-w-lg">
          {`Our straightforward pricing plans are tailored to meet your needs. If
          you're not ready to commit you can get started for free.`}
        </p>
        <div className="flex  justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            <PricingCard card={card} />
          ))}
        </div>
      </section>
      <IframeChat />
    </main>

  );
}

type Card = {
  title: string;
  description: string;
  price: string;
  duration: string;
  highlight: string;
  features: string[];
  priceId: string;
};

function PricingCard({ card }: { card: Card }) {
  return (
    <Card
      key={card.title}
      className={cn("w-[300px] flex flex-col justify-between", {
        "border-2 border-primary": card.title === "Unlimited",
      })}
    >
      <CardHeader>
        <CardTitle className="text-orange">{card.title}</CardTitle>
        <CardDescription>
          {pricingCards.find((c) => c.title === card.title)?.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-4xl font-bold">{card.price}</span>
        <span className="text-muted-foreground">
          <span>/ month</span>
        </span>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div>
          {card.features.map((feature) => (
            <div key={feature} className="flex gap-2">
              <Check />
              <p>{feature}</p>
            </div>
          ))}
        </div>
        <Link
          href={`/dashbord?plan=${card.title}`}
          className="bg-[#f3d299] dark:bg-orange transition text-gray-900 dark:text-white border-orange border-2 p-2 w-full text-center font-bold rounded-md"
        >
          Get Started
        </Link>
      </CardFooter>
    </Card>
  );
}
