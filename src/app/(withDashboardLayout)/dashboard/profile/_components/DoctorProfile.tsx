"use client";

import { useGetMyProfileQuery } from "@/redux/api/myProfile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Building2,
  DollarSign,
  Star,
  Shield,
  Edit,
  Stethoscope,
  GraduationCap,
  Clock,
  Clipboard,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Doctor, User as u } from "@/types";

const DoctorProfile = ({
  user,
  ownerProfile,
}: {
  user: Doctor & u;
  ownerProfile: boolean;
}) => {
  const router = useRouter();

  const doctorProfile = user;

  if (!doctorProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 p-4 md:p-8">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border border-gray-200/80 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-0">
              <div className="relative">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-[0.03]" />

                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="relative group"
                    >
                      <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-white shadow-lg dark:border-gray-800">
                        <AvatarImage
                          src={doctorProfile.profilePhoto || "/placeholder.svg"}
                          alt={doctorProfile.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white">
                          {doctorProfile.name?.split(" ")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Edit className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          Dr. {doctorProfile.name}
                        </h1>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-3">
                          {doctorProfile.designation}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Stethoscope className="w-3 h-3 mr-1.5" />
                            {doctorProfile.role}
                          </Badge>
                          <Badge
                            className={cn(
                              "border",
                              doctorProfile.status === "ACTIVE"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                            )}
                          >
                            <Shield className="w-3 h-3 mr-1.5" />
                            {doctorProfile.status}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <Star className="w-3 h-3 mr-1.5 fill-purple-500 text-purple-500" />
                            {doctorProfile.averageRating} Rating
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          {doctorProfile.currentWorkingPlace}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {doctorProfile.experience} years experience
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-blue-500" />$
                          {doctorProfile.appointmentFee} fee
                        </div>
                      </div>
                    </div>

                    {ownerProfile && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("/dashboard/profile/edit")}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Professional Information */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="shadow-sm border border-gray-200/80 dark:border-gray-800">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Professional Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={Award}
                    label="Registration Number"
                    value={doctorProfile.registrationNumber}
                    copyable
                    onCopy={handleCopy}
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Experience"
                    value={`${doctorProfile.experience} years`}
                  />
                  <InfoItem
                    icon={User}
                    label="Gender"
                    value={doctorProfile.gender}
                  />
                  <InfoItem
                    icon={DollarSign}
                    label="Appointment Fee"
                    value={`$${doctorProfile.appointmentFee}`}
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      QUALIFICATION
                    </h3>
                    <p className="text-sm font-medium">
                      {doctorProfile.qualification}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      CURRENT WORKPLACE
                    </h3>
                    <p className="text-sm font-medium">
                      {doctorProfile.currentWorkingPlace}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-sm border border-gray-200/80 dark:border-gray-800">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Performance Metrics
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    icon={Star}
                    value={doctorProfile.averageRating}
                    label="Average Rating"
                    color="text-yellow-500"
                    bgColor="bg-yellow-100/50 dark:bg-yellow-900/20"
                  />
                  <StatCard
                    icon={Clock}
                    value={doctorProfile.experience}
                    label="Years Experience"
                    color="text-green-500"
                    bgColor="bg-green-100/50 dark:bg-green-900/20"
                  />
                  <StatCard
                    icon={DollarSign}
                    value={`$${doctorProfile.appointmentFee}`}
                    label="Consultation Fee"
                    color="text-purple-500"
                    bgColor="bg-purple-100 dark:bg-purple-900/20"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-sm border border-gray-200/80 dark:border-gray-800">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Contact Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={doctorProfile.email}
                  copyable
                  onCopy={handleCopy}
                />
                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={doctorProfile.contactNumber}
                  copyable
                  onCopy={handleCopy}
                />
                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={doctorProfile.address as string}
                />
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="shadow-sm border border-gray-200/80 dark:border-gray-800">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Account Status
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </span>
                  <Badge
                    className={cn(
                      "border",
                      doctorProfile.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                    )}
                  >
                    {doctorProfile.status}
                  </Badge>
                </div>

                {doctorProfile.needPasswordChange && (
                  <div className="p-3 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          Password Change Required
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          Please update your password for security reasons.
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(doctorProfile.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">
                      {new Date(doctorProfile.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  copyable = false,
  onCopy,
}: {
  icon: any;
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: (text: string, label: string) => void;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
        {value}
      </p>
    </div>
    {copyable && (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        onClick={() => onCopy?.(value, label)}
      >
        <Clipboard className="w-3.5 h-3.5" />
      </Button>
    )}
  </div>
);

const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
  bgColor,
}: {
  icon: any;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
}) => (
  <motion.div
    className={cn(
      "text-center p-4 rounded-lg border border-gray-200/80 dark:border-gray-800",
      bgColor
    )}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div
      className={cn(
        "w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center",
        bgColor
      )}
    >
      <Icon className={cn("w-5 h-5", color)} />
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </motion.div>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 p-4 md:p-8">
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <Card className="overflow-hidden border border-gray-200/80 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Skeleton className="w-28 h-28 md:w-32 md:h-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-200/80">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200/80">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-200/80">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-gray-200/80">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-20 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorProfile;
