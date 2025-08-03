"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Admin, User as u } from "@/types";
import { motion } from "framer-motion";
import { Mail, Phone, Shield, User, Lock, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminProfile = ({ user }: { user: Admin & u }) => {
  const router = useRouter();

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
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information and settings
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user?.profilePhoto || undefined} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground capitalize">
                    {user?.role?.toLowerCase()}
                  </span>
                  <span className="mx-1">•</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      user?.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.contactNumber || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Member since:{" "}
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Account Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">
                      Role: {user?.role?.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 flex items-center justify-center">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user?.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                    </span>
                    <span className="capitalize">
                      Status: {user?.status?.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user?.needPasswordChange
                        ? "Password change required"
                        : "Password up to date"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 justify-end"
      >
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/profile/edit")}
        >
          Edit Profile
        </Button>
        {user?.needPasswordChange && (
          <Button onClick={() => router.push("/dashboard/change-password")}>
            Change Password
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
