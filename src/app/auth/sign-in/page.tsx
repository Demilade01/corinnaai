import SignInFormProvider from "@/components/forms/sign-in/form-provider";
import LoginForm from "@/components/forms/sign-in/login-form";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function SignIn() {
  return (
    <div className="flex-1 py-36 md:px-16 w-full">
      <div className="flex flex-col h-full gap-3">
        <SignInFormProvider>
          <div className="flex flex-col gap-3">
            <LoginForm />
            <div className="w-full flex flex-col gap-3 items-center">
              <Button type="submit" className="w-full">
                Submit
              </Button>
              <p>
                Don’t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({
                    variant: "link",
                    className: "!px-0 !py-0",
                  })}
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </SignInFormProvider>
      </div>
    </div>
  );
}
