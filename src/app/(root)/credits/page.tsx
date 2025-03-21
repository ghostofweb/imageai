"use client"; // this whole thing needs to be client-side for toast & SignedIn to work

import { SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { useToast } from "@/hooks/use-toast";


const Credits = () => {
  const { toast } = useToast();
  const { userId } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    } else {
      const fetchUser = async () => {
        const data = await getUserById(userId);
        setUser(data);
      };
      fetchUser();
    }
  }, [userId, router]);

  const handleDemoToast = () => {
    toast({
      title: "Demo Version",
      description: "Purchasing credits is disabled in the demo.",
    });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="credits-list">
          {plans.map((plan) => (
            <li key={plan.name} className="credits-item">
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 text-purple-500">
                  {plan.name}
                </p>
                <p className="h1-semibold text-dark-600">${plan.price}</p>
                <p className="p-16-regular">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Button onClick={handleDemoToast} className="credits-btn">
                    Buy Credits
                  </Button>
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;
