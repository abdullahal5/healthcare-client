"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Upload, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const Register = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      console.log("Profile Image:", profileImage);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="container max-w-md flex items-center justify-center lg:h-[100vh] mx-auto px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-6">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Patient Register
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription className="text-blue-100">
              Create your account to get started with our healthcare services
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center justify-center -mt-12 mb-6">
                  <div className="relative w-28 h-28 mb-3">
                    {profileImage ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                        <User className="w-12 h-12 text-blue-300" />
                      </div>
                    )}
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors duration-200"
                    >
                      <Upload className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {profileImage ? "Change photo" : "Upload your photo"}
                  </span>
                </div>

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                          <Input
                            placeholder="John Doe"
                            className="pl-10 border-slate-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                          <Input
                            placeholder="your.email@example.com"
                            type="email"
                            className="pl-10 border-slate-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                          <Input
                            placeholder="••••••••"
                            type="password"
                            className="pl-10 border-slate-200 focus-visible:ring-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Registration Successful
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-slate-50 border-t border-slate-100">
          <motion.div variants={itemVariants} className="text-center w-full">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Register;
