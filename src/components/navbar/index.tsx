import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function NavBar() {
  return (
    <div className="flex gap-5 justify-between items-center px-7 py-1 font-bold border-b border-solid border-zinc-100 dark:border-zinc-800 leading-[154.5%] max-md:flex-wrap max-md:px-5">
      <div className="relative flex gap-1.5 justify-center self-stretch my-auto text-2xl tracking-tighter text-neutral-700">
        <Image
          src="/images/logo.png"
          alt="LOGO"
          sizes="100vw"
          style={{
            width: "100px",
            height: "auto",
            clipPath: "polygon(0 0, 20% 0, 20% 100%, 0 100%)",
          }}
          width={0}
          height={0}
        />
        <Image
          src="/images/logo.png"
          alt="LOGO"
          sizes="100vw"
          className="absolute inset-0 dark:invert"
          style={{
            width: "100px",
            height: "auto",
            clipPath: "polygon(20% 0, 100% 0%, 100% 100%, 20% 100%)",
          }}
          width={0}
          height={0}
        />
      </div>
      <ul className="gap-5 justify-between self-stretch my-auto text-sm leading-5 text-neutral-700 dark:text-neutral-100 max-md:flex-wrap max-md:max-w-full font-normal hidden md:flex">
        <li>Home</li>
        <li>Pricing</li>
        <li>News Room</li>
        <li>Features</li>
        <li>Contact us</li>
      </ul>
      <Link
        href="/dashboard"
        className="bg-orange hover:bg-orange/90 transition px-4 py-2 rounded-sm text-white"
      >
        Free Trial
      </Link>
    </div>
  );
}

export default NavBar;
