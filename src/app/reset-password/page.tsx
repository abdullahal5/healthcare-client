"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, useForm } from "react-hook-form";
import {
  CheckCircle2,
  Lock,
  Key,
  ArrowRight,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import {
  loginContainerVariants,
  loginItemVariants,
} from "@/Transition/login.transition";
import type { z } from "zod";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/schema/reset-password.schema";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/api/authApi";

const formVariants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const cardHeaderVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const successVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const searchParams = useSearchParams();

  const userId = searchParams.get("userId") ?? undefined;
  const token = searchParams.get("token");

  // Reset password form
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      id: userId,
      password: "",
    },
  });

  const onResetPasswordSubmit = async (data: FieldValues) => {
    try {
       const res = (await resetPassword({
         data,
         token,
       })) as any;

      if (res.error) {
        toast.error(res?.error?.data?.message);
      } else {
        toast.success("Password reset successfully!");
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={loginContainerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={loginItemVariants}>
          <Card className="border border-slate-300 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/20">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="reset-form"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={formVariants}
                >
                  <CardHeader className="space-y-1">
                    <motion.div variants={cardHeaderVariants}>
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-center">
                        Reset Your Password
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={cardHeaderVariants}>
                      <CardDescription className="text-center">
                        Enter your new password to secure your account
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <Form {...resetPasswordForm}>
                      <HCForm
                        defaultValues={{
                          id: userId,
                          password: "",
                        }}
                        resolver={zodResolver(resetPasswordSchema)}
                        onSubmit={onResetPasswordSubmit}
                      >
                        <motion.div
                          variants={loginItemVariants}
                          className="space-y-6"
                        >
                          <HCInput
                            label="Id"
                            placeholder="Enter your reset token"
                            name="id"
                            type="text"
                            size="lg"
                            icon={Key}
                            required
                            disabled
                          />

                          <HCInput
                            label="Password"
                            placeholder="Enter your new password"
                            name="password"
                            size="lg"
                            type="password"
                            icon={Lock}
                            required
                          />

                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 transition-all mt-6 duration-200 shadow-md hover:shadow-lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Resetting Password...
                              </div>
                            ) : (
                              <>
                                Reset Password <ArrowRight className="ml-2" />
                              </>
                            )}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleBackToLogin}
                            className="w-full font-medium py-6 transition-all duration-200 bg-transparent"
                          >
                            <ArrowLeft className="mr-2" />
                            Back to Login
                          </Button>
                        </motion.div>
                      </HCForm>
                    </Form>
                  </CardContent>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial="initial"
                  animate="animate"
                  variants={successVariants}
                >
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-green-700">
                      Password Reset Successful!
                    </CardTitle>
                    <CardDescription className="text-center">
                      Your password has been successfully updated. You can now
                      log in with your new password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleBackToLogin}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Continue to Login <ArrowRight className="ml-2" />
                    </Button>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
