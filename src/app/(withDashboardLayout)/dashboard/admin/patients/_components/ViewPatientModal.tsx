"use client";

import { useGetPatientByIdQuery } from "@/redux/api/patientApi";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Droplet,
  HeartPulse,
  Cake,
  Scale,
  Ruler,
  Utensils,
  Baby,
  Brain,
  Syringe,
  Smile,
  Frown,
  FileText,
  AlarmSmoke,
} from "lucide-react";
import ModalLoadingContent from "@/components/Shared/DashboardUtils/ModalLoadingContent";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  containerDoctorViewVariants,
  itemDoctorViewariants,
} from "@/Transition";
import { DoctorSpecialties } from "@/types";

const ViewPatientModal = ({
  open,
  setOpen,
  patientId,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  patientId: string;
}) => {
  const {
    data: singlePatientInfo,
    isLoading,
    isFetching,
  } = useGetPatientByIdQuery(patientId, {
    skip: !patientId,
  });

  const patient = singlePatientInfo;

  return (
    <div>
      <HCModal width="lg" open={open} setOpen={setOpen} title="Patient Details">
        {isFetching || isLoading ? (
          <ModalLoadingContent />
        ) : (
          <motion.div
            variants={containerDoctorViewVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header Section */}
            <motion.div
              variants={itemDoctorViewariants}
              className="flex items-start gap-4"
            >
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage
                  className="object-cover"
                  src={patient?.profilePhoto}
                />
                <AvatarFallback className="text-2xl font-bold bg-primary/10">
                  {patient?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{patient?.name}</h2>
                  <Badge
                    variant="outline"
                    className={
                      patient?.user?.status === "ACTIVE"
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }
                  >
                    {patient?.user?.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {patient?.patientHealthData?.maritalStatus}
                </p>

                <div className="flex items-center mt-2 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {new Date(
                        patient?.patientHealthData?.dateOfBirth
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="h-4 w-4 text-red-500" />
                    <span className="font-medium">
                      {patient?.patientHealthData?.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <Separator />

            {/* Contact Information */}
            <motion.div variants={itemDoctorViewariants}>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {patient?.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Contact Number
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {patient?.contactNumber}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      {patient?.address}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(patient?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health Information */}
            <motion.div variants={itemDoctorViewariants}>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Health Information
                  </h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="flex items-center gap-2">
                      <Cake className="h-4 w-4" />
                      {new Date(
                        patient?.patientHealthData?.dateOfBirth
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="flex items-center gap-2">
                      <Droplet className="h-4 w-4" />
                      {patient?.patientHealthData?.bloodGroup}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {patient?.patientHealthData?.height}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      {patient?.patientHealthData?.weight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health Status */}
            <motion.div variants={itemDoctorViewariants}>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Health Status
                  </h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Allergies</p>
                    <p>
                      {patient?.patientHealthData?.hasAllergies ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Diabetes</p>
                    <p>
                      {patient?.patientHealthData?.hasDiabetes ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Smoking</p>
                    <p className="flex items-center gap-2">
                      <AlarmSmoke className="h-4 w-4" />
                      {patient?.patientHealthData?.smokingStatus ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Diet</p>
                    <p className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      {patient?.patientHealthData?.dietaryPreferences}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Past Surgeries
                    </p>
                    <p className="flex items-center gap-2">
                      {/* <Scalpel className="h-4 w-4" /> */}
                      {patient?.patientHealthData?.hasPastSurgeries ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Immunization
                    </p>
                    <p className="flex items-center gap-2">
                      <Syringe className="h-4 w-4" />
                      {patient?.patientHealthData?.immunizationStatus}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mental Health */}
            <motion.div variants={itemDoctorViewariants}>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Mental Health
                  </h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Recent Anxiety
                    </p>
                    <p className="flex items-center gap-2">
                      {patient?.patientHealthData?.recentAnxiety ? (
                        <>
                          <Frown className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">Yes</Badge>
                        </>
                      ) : (
                        <>
                          <Smile className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary">No</Badge>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Recent Depression
                    </p>
                    <p className="flex items-center gap-2">
                      {patient?.patientHealthData?.recentDepression ? (
                        <>
                          <Frown className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">Yes</Badge>
                        </>
                      ) : (
                        <>
                          <Smile className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary">No</Badge>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Mental Health History
                    </p>
                    <p>
                      {patient?.patientHealthData?.mentalHealthHistory ||
                        "None reported"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Medical Reports */}
            {patient?.medicalReport?.length > 0 && (
              <motion.div variants={itemDoctorViewariants}>
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Medical Reports ({patient.medicalReport.length})
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patient.medicalReport.map((report: any) => (
                        <div key={report.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{report.reportName}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded:{" "}
                                {new Date(
                                  report.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <a
                              href={report.reportLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Report
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </HCModal>
    </div>
  );
};

export default ViewPatientModal;
