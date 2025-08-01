"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Ruler,
  Weight,
  Droplets,
  AlertTriangle,
  Shield,
  Edit,
  FileText,
  Plus,
  Download,
  Eye,
  Cigarette,
  Utensils,
  Brain,
  Syringe,
  Scissors,
  Frown,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModalQuery } from "@/hooks/useModalQuery";
import ReportModal from "./modal/ReportModal";
import { MedicalReport, Patient, User as u } from "@/types";

const PatientProfile = ({
  user,
  ownerProfile,
}: {
  user: Patient & u;
  ownerProfile: boolean;
}) => {
  const router = useRouter();

  const patientProfile = user;

  const {
    id,
    isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModalQuery("reportModalId");

  if (!user) {
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

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 p-4 md:p-8">
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
                            src={
                              patientProfile.profilePhoto ||
                              "/placeholder.svg?height=128&width=128&query=patient avatar"
                            }
                            alt={patientProfile.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white">
                            {patientProfile.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Edit className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {patientProfile.name}
                          </h1>
                          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-3">
                            Patient Profile
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <User className="w-3 h-3 mr-1.5" />
                              {patientProfile.role}
                            </Badge>
                            <Badge
                              className={cn(
                                "border",
                                patientProfile.status === "ACTIVE"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                              )}
                            >
                              <Shield className="w-3 h-3 mr-1.5" />
                              {patientProfile.status}
                            </Badge>
                            {patientProfile.patientHealthData && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <Heart className="w-3 h-3 mr-1.5" />
                                {calculateAge(
                                  patientProfile.patientHealthData.dateOfBirth
                                )}{" "}
                                years old
                              </Badge>
                            )}
                          </div>
                        </div>
                        {patientProfile.patientHealthData && (
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Droplets className="w-4 h-4 text-red-500" />
                              {patientProfile.patientHealthData.bloodGroup.replace(
                                "_",
                                " "
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4 text-blue-500" />
                              {patientProfile.patientHealthData.gender}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-purple-500" />
                              {patientProfile.patientHealthData.maritalStatus.replace(
                                "_",
                                " "
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {ownerProfile && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push("/dashboard/profile/edit")
                            }
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
            {/* Health Information */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              {/* Health Data */}
              <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                      <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                      Health Information
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patientProfile.patientHealthData ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem
                          icon={Calendar}
                          label="Date of Birth"
                          value={new Date(
                            patientProfile.patientHealthData.dateOfBirth
                          ).toLocaleDateString()}
                        />
                        <InfoItem
                          icon={User}
                          label="Gender"
                          value={patientProfile.patientHealthData.gender}
                        />
                        <InfoItem
                          icon={Droplets}
                          label="Blood Group"
                          value={patientProfile.patientHealthData.bloodGroup.replace(
                            "_",
                            " "
                          )}
                        />
                        <InfoItem
                          icon={Users}
                          label="Marital Status"
                          value={patientProfile.patientHealthData.maritalStatus.replace(
                            "_",
                            " "
                          )}
                        />
                        <InfoItem
                          icon={Ruler}
                          label="Height"
                          value={patientProfile.patientHealthData.height}
                        />
                        <InfoItem
                          icon={Weight}
                          label="Weight"
                          value={patientProfile.patientHealthData.weight}
                        />
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <HealthStatusItem
                          label="Allergies"
                          value={
                            patientProfile.patientHealthData
                              .hasAllergies as boolean
                          }
                          icon={AlertTriangle}
                        />
                        <HealthStatusItem
                          label="Diabetes"
                          value={
                            patientProfile.patientHealthData
                              .hasDiabetes as boolean
                          }
                          icon={Activity}
                        />
                        <HealthStatusItem
                          label="Smoking"
                          value={
                            patientProfile.patientHealthData
                              .smokingStatus as boolean
                          }
                          icon={Cigarette}
                        />
                        <HealthStatusItem
                          label="Past Surgeries"
                          value={
                            patientProfile.patientHealthData
                              .hasPastSurgeries as boolean
                          }
                          icon={Scissors}
                        />
                        <HealthStatusItem
                          label="Recent Anxiety"
                          value={
                            patientProfile.patientHealthData
                              .recentAnxiety as boolean
                          }
                          icon={Brain}
                        />
                        <HealthStatusItem
                          label="Recent Depression"
                          value={
                            patientProfile.patientHealthData
                              .recentDepression as boolean
                          }
                          icon={Frown}
                        />
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-4">
                        <InfoItem
                          icon={Utensils}
                          label="Dietary Preferences"
                          value={
                            patientProfile.patientHealthData
                              .dietaryPreferences as string
                          }
                        />
                        <InfoItem
                          icon={Brain}
                          label="Mental Health History"
                          value={
                            patientProfile.patientHealthData
                              .mentalHealthHistory as string
                          }
                        />
                        <InfoItem
                          icon={Syringe}
                          label="Immunization Status"
                          value={
                            patientProfile.patientHealthData
                              .immunizationStatus as string
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Health Data Available
                      </h3>
                      {ownerProfile && (
                        <>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Add your health information to help doctors provide
                            better care.
                          </p>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Edit className="w-6 h-6 text-white" />
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medical Reports */}
              <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Medical Reports
                    </h2>
                    {ownerProfile && (
                      <Button
                        onClick={() => openCreateModal(patientProfile?.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Report
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {patientProfile.medicalReport &&
                  patientProfile.medicalReport.length > 0 ? (
                    <div className="space-y-3">
                      {patientProfile.medicalReport.map(
                        (report: MedicalReport) => (
                          <motion.div
                            key={report.id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {report.reportName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(report.reportLink, "_blank")
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(report.reportLink, "_blank")
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Medical Reports
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Upload your medical reports to keep track of your health
                        records.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Contact Information */}
              <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Contact Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={patientProfile.email}
                    copyable
                    onCopy={handleCopy}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={patientProfile.contactNumber as string}
                    copyable
                    onCopy={handleCopy}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={patientProfile.address as string}
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
                        patientProfile.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                      )}
                    >
                      {patientProfile.status}
                    </Badge>
                  </div>
                  {patientProfile.needPasswordChange && (
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
                        {new Date(patientProfile.createdAt).toLocaleDateString(
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
                        {new Date(patientProfile.updatedAt).toLocaleDateString(
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

      {isCreateModalOpen && (
        <ReportModal open={true} setOpen={closeCreateModal} id={id as string} />
      )}
    </>
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
        <FileText className="w-3.5 h-3.5" />
      </Button>
    )}
  </div>
);

const HealthStatusItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: boolean;
  icon: any;
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
    <Badge
      className={cn(
        "text-xs",
        value
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      )}
    >
      {value ? "Yes" : "No"}
    </Badge>
  </div>
);

export default PatientProfile;
