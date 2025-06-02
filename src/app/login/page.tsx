"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { CheckCircle2, Lock, Mail, ArrowRight } from "lucide-react";
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
import { formSchema } from "@/schema/login.schema";
import { z } from "zod";
import { userLogin } from "@/services/action/login";
import { toast } from "sonner";
import { storeUserInfo } from "@/services/auth.services";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "super@admin.com",
      password: "superadmin",
    },
  });

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const res = await userLogin(data);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        if (res.data) {
          const { accessToken } = res.data;
          storeUserInfo(accessToken);
        }
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
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
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <HCForm
                  defaultValues={{
                    email: "super@admin.com",
                    password: "superadmin",
                  }}
                  resolver={zodResolver(formSchema)}
                  onSubmit={onSubmit}
                >
                  <motion.div
                    variants={loginItemVariants}
                    className="space-y-6"
                  >
                    <HCInput
                      label="Email"
                      placeholder="jhondoe@gmail.com"
                      name="email"
                      type="email"
                      size="lg"
                      icon={Mail}
                      required
                    />

                    <HCInput
                      label="Password"
                      placeholder="******"
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
                          Logging in...
                        </div>
                      ) : (
                        <>
                          Login <ArrowRight className="ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </HCForm>
              </Form>

              <div className="mt-6 text-center text-sm">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
                or
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline hover:text-primary/80"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
