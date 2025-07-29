"use client";

import { motion } from "framer-motion";
import { FieldValues } from "react-hook-form";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const router = useRouter()

  const onSubmit = async (values: FieldValues) => {
    const res = await changePassword(values);

    try {
      if (res?.error) {
        toast.error("Password do not matched");
      } else {
        localStorage.removeItem("accessToken");
        toast.success("Password changed successfully. Please login again.");
        router.push("/login");
      }
    } catch {
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-xl overflow-hidden border">
          <CardHeader className="text-center space-y-1">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Lock className="mx-auto h-10 w-10 text-blue-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Change Password
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your old and new password below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <HCForm
              defaultValues={{
                oldPassword: "",
                newPassword: "",
              }}
              onSubmit={onSubmit}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <HCInput
                    label="Current Password"
                    placeholder="Enter your old password"
                    name="oldPassword"
                    type="password"
                    icon={Lock}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <HCInput
                    label="New Password"
                    placeholder="Enter your new password"
                    name="newPassword"
                    type="password"
                    icon={Lock}
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6"
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-6 transition-all duration-200 shadow-md hover:shadow-lg rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      Update Password <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </HCForm>
          </CardContent>
        </Card>

        {/* Success message (example) */}
        {/* {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Password changed successfully!
          </motion.div>
        )} */}
      </motion.div>
    </div>
  );
};

export default ChangePassword;
