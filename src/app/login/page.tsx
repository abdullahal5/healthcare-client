"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, useForm, useFormContext } from "react-hook-form";
import {
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Clock,
  User,
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
import HCSelect from "@/components/Forms/HCSelect";
import {
  loginContainerVariants,
  loginItemVariants,
} from "@/Transition/login.transition";
import { z } from "zod";
import { userLogin } from "@/services/action/login";
import { toast } from "sonner";
import { storeUserInfo } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { defaultCredentials, roleOptions } from "@/constant/login";

// Updated schema to include role
const loginSchema = z.object({
  role: z.enum(["admin", "doctor", "patient", "superAdmin"]),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

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

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [forgotPassword, { isLoading: forgotPasswordLoading }] =
    useForgotPasswordMutation();
  const router = useRouter();

  // Forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Timer effect for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onLoginSubmit = async (data: FieldValues) => {
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

          // Redirect based on role
          if (data.role === "admin") {
            router.push("/dashboard/admin");
          } else if (data.role === "doctor") {
            router.push("/dashboard/doctor");
          } else {
            router.push("/dashboard/patient");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const res = await forgotPassword(data);
      if (res.error) {
        toast.error("Something is wrong");
      } else {
        toast.success(res.data.message);
        setEmailSent(true);
        setResendTimer(120); // 2 minutes timer
      }
    } catch (error) {
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const email = forgotPasswordForm.getValues("email");
      const res = await forgotPassword({ email });

      if (res.error) {
        toast.error("Failed to resend email");
      } else {
        toast.success("Password reset email sent again!");
        setResendTimer(120); // Reset timer to 2 minutes
      }
    } catch (error) {
      toast.error("Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setEmailSent(false);
    setResendTimer(0);
    forgotPasswordForm.reset();
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setEmailSent(false);
    setResendTimer(0);
    loginForm.reset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "admin",
      email: defaultCredentials.admin.email,
      password: defaultCredentials.admin.password,
    },
  });

  const handleRoleChange = (
    role: "admin" | "doctor" | "patient" | "superAdmin"
  ) => {
    loginForm.reset({
      role,
      email: defaultCredentials[role].email,
      password: defaultCredentials[role].password,
    });
  };

  const RoleWatcher = ({ defaultCredentials }: { defaultCredentials: any }) => {
    const { watch, setValue } = useFormContext();
    const role = watch("role");

    useEffect(() => {
      if (role && defaultCredentials[role]) {
        setValue("email", defaultCredentials[role].email);
        setValue("password", defaultCredentials[role].password);
      }
    }, [role, setValue, defaultCredentials]);

    return null;
  };

  const defaultRole = "superAdmin";

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
              <motion.div
                key={isForgotPassword ? "forgot" : "login"}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={formVariants}
              >
                <CardHeader className="space-y-1">
                  <motion.div variants={cardHeaderVariants}>
                    <CardTitle className="text-2xl font-bold text-center">
                      {isForgotPassword ? "Reset Password" : "Welcome back"}
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={cardHeaderVariants}>
                    <CardDescription className="text-center">
                      {isForgotPassword
                        ? emailSent
                          ? "We've sent a password reset link to your email"
                          : "Enter your email address to reset your password"
                        : "Enter your credentials to sign in to your account"}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent>
                  {!isForgotPassword ? (
                    // Login Form
                    <Form {...loginForm}>
                      <HCForm
                        defaultValues={{
                          role: defaultRole,
                          email: defaultCredentials[defaultRole].email,
                          password: defaultCredentials[defaultRole].password,
                        }}
                        resolver={zodResolver(loginSchema)}
                        onSubmit={onLoginSubmit}
                      >
                        <RoleWatcher defaultCredentials={defaultCredentials} />
                        <motion.div
                          variants={loginItemVariants}
                          className="space-y-6"
                        >
                          <HCSelect
                            name="role"
                            label="Login as"
                            placeholder="Select your role"
                            options={roleOptions}
                            size="lg"
                            onChange={(role) =>
                              handleRoleChange(
                                role as
                                  | "admin"
                                  | "doctor"
                                  | "patient"
                                  | "superAdmin"
                              )
                            }
                            required
                          />

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
                  ) : (
                    // Forgot Password Form
                    <Form {...forgotPasswordForm}>
                      <HCForm
                        resolver={zodResolver(forgotPasswordSchema)}
                        onSubmit={onForgotPasswordSubmit}
                      >
                        <motion.div
                          variants={loginItemVariants}
                          className="space-y-6"
                        >
                          {emailSent && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                              <span className="text-sm text-green-700">
                                Email sent successfully!
                              </span>
                            </motion.div>
                          )}

                          <HCInput
                            label="Email Address"
                            placeholder="Enter your email address"
                            name="email"
                            type="email"
                            size="lg"
                            icon={Mail}
                            required
                            disabled={emailSent}
                          />

                          {!emailSent ? (
                            <Button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 transition-all mt-6 duration-200 shadow-md hover:shadow-lg"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Sending...
                                </div>
                              ) : (
                                <>
                                  Send Reset Email <Mail className="ml-2" />
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={handleResendEmail}
                              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-6 transition-all mt-6 duration-200 shadow-md hover:shadow-lg"
                              disabled={isLoading || resendTimer > 0}
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Sending...
                                </div>
                              ) : resendTimer > 0 ? (
                                <div className="flex items-center justify-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Resend in {formatTime(resendTimer)}
                                </div>
                              ) : (
                                <>
                                  Resend Email <Mail className="ml-2" />
                                </>
                              )}
                            </Button>
                          )}

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
                  )}

                  {!isForgotPassword && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 text-center text-sm"
                    >
                      <button
                        onClick={handleForgotPasswordClick}
                        className="text-sm text-primary hover:underline hover:text-primary/80"
                      >
                        Forgot password?
                      </button>
                    </motion.div>
                  )}
                </CardContent>

                {!isForgotPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="px-6 pb-6"
                  >
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
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
