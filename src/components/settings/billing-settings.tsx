import { onGetSubscriptionPlan } from "@/actions/settings";
import { pricingCards } from "@/constants/landing-page";
import { CheckCircle2, Plus } from "lucide-react";
import Image from "next/image";
import SubscriptionForm from "../forms/settings/subscription-form";
import Modal from "../modal";
import Section from "../section-label";
import { Card, CardContent, CardDescription } from "../ui/card";

type Props = {};

const BillingSettings = async (props: Props) => {
  const plan = await onGetSubscriptionPlan();
  const planFeatures = pricingCards.find(
    (card) => card.title.toUpperCase() === plan?.toUpperCase()
  )?.features;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-1">
        <Section
          label="Billing settings"
          message="Add payment information, upgrade and modify your plan."
        />
      </div>
      <div className="lg:col-span-2 flex justify-start lg:justify-center ">
        <Modal
          title="Choose A Plan"
          description="Tell us about yourself! What do you do? Let’s tailor your experience so it best suits you."
          trigger={
            plan === "STANDARD" ? (
              <Card className="border-dashed bg-cream dark:bg-zinc-900 border-gray-400 dark:border-zinc-700 w-full cursor-pointer h-[270px] flex justify-center items-center">
                <CardContent className="flex gap-2 items-center">
                  <div className="rounded-full border-2 border-gray-900 dark:border-gray-400  p-1">
                    <Plus className="text-gray-900 dark:text-gray-400 " />
                  </div>
                  <CardDescription className="font-semibold text-gray-900 dark:text-gray-400">
                    Upgrade Plan
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <Image
                src="/images/creditcard.png"
                width={400}
                height={400}
                alt="image"
              />
            )
          }
        >
          <SubscriptionForm plan={plan!} />
        </Modal>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
        <p className="text-sm font-semibold">{plan}</p>
        <div className="flex gap-2 flex-col mt-2">
          {planFeatures && planFeatures.map((feature) => (
            <div key={feature} className="flex gap-2">
              <CheckCircle2 className="text-muted-foreground" />
              <p className="text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
