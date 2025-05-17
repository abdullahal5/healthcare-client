"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Lock,
  Upload,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import Link from "next/link";
import {
  registerContainerVariants,
  registerItemVariants,
} from "@/Transition/register.transition";
import { formSchema } from "@/schema/register.schema";
import { handleImageUpload, modifyPayload } from "@/utils/modifyPayload";
import { registerPatient } from "@/services/action/registerPatient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Register = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      patient: {
        name: "",
        email: "",
      },
    },
  });

  const onSubmit = async (values: FieldValues) => {
    const data = modifyPayload(values);
    try {
      const res = await registerPatient(data);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/login");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <motion.div
      className="container max-w-md flex items-center justify-center lg:h-[100vh] mx-auto px-4"
      initial="hidden"
      animate="visible"
      variants={registerContainerVariants}
    >
      <motion.div variants={registerItemVariants}>
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Patient Register
            </CardTitle>
            <CardDescription className="text-blue-100">
              Create your account to get started with our healthcare services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <HCForm
                resolver={zodResolver(formSchema)}
                defaultValues={{
                  password: "",
                  patient: {
                    name: "",
                    email: "",
                  },
                }}
                onSubmit={onSubmit}
              >
                <motion.div
                  variants={registerItemVariants}
                  className="space-y-6"
                >
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
                        onChange={(e) => handleImageUpload(e, setProfileImage)}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {profileImage ? "Change photo" : "Upload your photo"}
                    </span>
                  </div>

                  <HCInput
                    label="Full Name"
                    placeholder="jhon doe"
                    icon={User}
                    size="lg"
                    name="patient.name"
                    type="text"
                  />

                  <HCInput
                    label="Email"
                    placeholder="jhondoe@gmail.com"
                    name="patient.email"
                    type="email"
                    size="lg"
                    icon={Mail}
                  />

                  <HCInput
                    label="Password"
                    placeholder="******"
                    name="password"
                    size="lg"
                    type="password"
                    icon={Lock}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 transition-all mt-6 duration-200 shadow-md hover:shadow-lg"
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
                      <>
                        Create Account <ArrowRight />
                      </>
                    )}
                  </Button>
                </motion.div>
              </HCForm>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-slate-50 border-t border-slate-100">
            <div className="text-center w-full">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Register;
