"use client";


import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();

  const onCheckout = () => {
    toast({
      title: "Demo Version",
      description: "Purchasing credits is disabled in the demo.",
      duration: 5000,
      className: "info-toast",
    });
  };

  return (
    <Button
      onClick={onCheckout}
      className="w-full rounded-full bg-purple-gradient bg-cover"
    >
      Buy Credit
    </Button>
  );
};

export default Checkout;
