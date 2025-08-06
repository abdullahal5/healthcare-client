"use client";

import type React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Home,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  bgColorClass: string;
  textColorClass: string;
  buttonVariant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  buttonText: string;
  showRetry?: boolean;
  showContact?: boolean;
  pulseEffect?: boolean;
}

interface PaymentStatusDisplayProps {
  status: string;
  transactionId?: string;
}

const PaymentStatusDisplay = ({
  status,
  transactionId,
}: PaymentStatusDisplayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const statusConfigs: Record<string, StatusConfig> = {
    success: {
      icon: <CheckCircle className="h-24 w-24 text-green-500" />,
      title: "Payment Successful!",
      message:
        "Your transaction has been completed successfully. A confirmation has been sent to your email.",
      bgColorClass:
        "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950",
      textColorClass: "text-green-800 dark:text-green-200",
      buttonVariant: "default",
      buttonText: "Back to Home",
      pulseEffect: true,
    },
    cancel: {
      icon: <XCircle className="h-24 w-24 text-amber-500" />,
      title: "Payment Canceled",
      message:
        "Your payment was not completed. No amount was deducted from your account.",
      bgColorClass:
        "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-950",
      textColorClass: "text-amber-800 dark:text-amber-200",
      buttonVariant: "outline",
      buttonText: "Try Again",
      showRetry: true,
    },
    failed: {
      icon: <AlertCircle className="h-24 w-24 text-red-500" />,
      title: "Payment Failed",
      message:
        "We couldn't process your payment. Please check your payment details and try again.",
      bgColorClass:
        "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950",
      textColorClass: "text-red-800 dark:text-red-200",
      buttonVariant: "destructive",
      buttonText: "Retry Payment",
      showRetry: true,
      showContact: true,
    },
    pending: {
      icon: <HelpCircle className="h-24 w-24 text-blue-500" />,
      title: "Payment Pending",
      message:
        "Your payment is being processed. This may take a few minutes. We'll notify you once it's complete.",
      bgColorClass:
        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950",
      textColorClass: "text-blue-800 dark:text-blue-200",
      buttonVariant: "secondary",
      buttonText: "Check Status",
      showContact: true,
    },
    unknown: {
      icon: <HelpCircle className="h-24 w-24 text-gray-500" />,
      title: "Payment Status Unknown",
      message:
        "We couldn't determine the status of your payment. Please check back later or contact support.",
      bgColorClass:
        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-950",
      textColorClass: "text-gray-800 dark:text-gray-200",
      buttonVariant: "secondary",
      buttonText: "Contact Support",
      showContact: true,
    },
  };

  const config = statusConfigs[status] || statusConfigs.unknown;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card
          className={cn(
            "overflow-hidden border-none shadow-xl",
            config.bgColorClass
          )}
        >
          <div className="absolute right-4 top-4">
            <CreditCard
              className={cn("h-10 w-10 opacity-10", config.textColorClass)}
            />
          </div>
          <CardHeader className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={isVisible ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={cn(
                "flex justify-center",
                config.pulseEffect ? "animate-pulse" : ""
              )}
            >
              {config.icon}
            </motion.div>
            <CardTitle
              className={cn(
                "mt-6 text-3xl font-bold tracking-tight",
                config.textColorClass
              )}
            >
              {config.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <p
              className={cn(
                "text-center text-lg leading-relaxed",
                config.textColorClass
              )}
            >
              {config.message}
            </p>

            {transactionId && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transaction ID:{" "}
                  <span className="font-mono">{transactionId}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <Button
                asChild
                size="lg"
                variant={config.buttonVariant}
                className="w-full gap-2 text-base font-semibold"
              >
                <Link href="/">
                  <Home className="h-5 w-5" />
                  {config.buttonText}
                </Link>
              </Button>

              {config.showRetry && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 text-base font-semibold bg-transparent"
                >
                  <Link href="/checkout">
                    <ArrowLeft className="h-5 w-5" />
                    Back to Checkout
                  </Link>
                </Button>
              )}

              {config.showContact && (
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className={cn(
                    "w-full gap-2 text-base font-semibold",
                    config.textColorClass
                  )}
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              )}
            </div>
          </CardContent>
          <div className="absolute bottom-4 left-4">
            <CreditCard
              className={cn("h-8 w-8 opacity-10", config.textColorClass)}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentStatusDisplay;
