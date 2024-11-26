"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthContext } from "@/context/use-auth-context";
import { useSignUpForm } from "@/hooks/sign-up/use-sign-up";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

type Props = {};

const ButtonHandler = (props: Props) => {
  const { currentStep, setCurrentStep } = useAuthContext();
  const { formState, getFieldState, getValues } = useFormContext();
  const { onGenerateOTP } = useSignUpForm();

  const { isDirty: isName } = getFieldState("fullname", formState);
  const { isDirty: isEmail } = getFieldState("email", formState);
  const { isDirty: isPassword } = getFieldState("password", formState);

  if (currentStep === 3) {
    return (
      <div className="w-full flex flex-col gap-3 items-center">
        <Button type="submit" className="w-full">
          Create an account
        </Button>
        <p>
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className={buttonVariants({
              variant: "link",
              className: "!px-0 !py-0",
            })}
          >
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="w-full flex flex-col gap-3 items-center">
        <Button
          type="submit"
          className="w-full"
          {...(isName &&
            isEmail &&
            isPassword && {
              onClick: () =>
                onGenerateOTP(
                  getValues("email"),
                  getValues("password"),
                  setCurrentStep
                ),
            })}
        >
          Continue
        </Button>
        <p>
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className={buttonVariants({
              variant: "link",
              className: "!px-0 !py-0",
            })}
          >
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <Button
        type="submit"
        className="w-full"
        onClick={() => setCurrentStep((prev) => prev + 1)}
      >
        Continue
      </Button>
      <p>
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className={buttonVariants({
            variant: "link",
            className: "!px-0 !py-0",
          })}
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ButtonHandler;
