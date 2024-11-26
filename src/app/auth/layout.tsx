import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) redirect("/dashboard");

  return (
    <div className="h-screen flex justify-center">
      <div className="w-[600px] flex flex-col items-start p-6">
        <div className="relative">
          <Image
            src="/images/logo.png"
            alt="logo"
            sizes="100vw"
            style={{
              width: "20%",
              height: "auto",
              clipPath: "polygon(0 0, 20% 0, 20% 100%, 0 100%)",
            }}
            width={0}
            height={0}
          />
          <Image
            src="/images/logo.png"
            alt="logo"
            sizes="100vw"
            className="absolute inset-0 dark:invert"
            style={{
              width: "20%",
              height: "auto",
              clipPath: "polygon(20% 0, 100% 0%, 100% 100%, 20% 100%)",
            }}
            width={0}
            height={0}
          />
        </div>
        {children}
      </div>
      <div className="light hidden lg:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-cream flex-col pt-10 pl-24 gap-3">
        <h2 className="text-gravel md:text-4xl font-bold">
          {"Hi, I'm your AI powered sales assistant, Corinna"}
        </h2>
        <p className="text-iridium md:text-sm mb-10">
          Corinna is capable of capturing lead information without a form...{" "}
          <br />
          something never done before
        </p>
        <Image
          src="/images/app-ui.png"
          alt="app image"
          loading="lazy"
          sizes="30"
          className="absolute shrink-0 !w-[1600px] top-48"
          width={0}
          height={0}
        />
      </div>
    </div>
  );
}
