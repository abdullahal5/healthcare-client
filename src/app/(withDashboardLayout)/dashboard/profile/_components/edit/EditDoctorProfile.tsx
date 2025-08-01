"use client";

import HCFileUploader from "@/components/Forms/HCFileUploader";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCSelect from "@/components/Forms/HCSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/myProfile";
import { itemVariants } from "@/Transition";
import { modifyPayload } from "@/utils/modifyPayload";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  DollarSign,
  Phone,
  User,
  UserCheck,
  Building2,
  GraduationCap,
  Stethoscope,
  Save,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const EditDoctorProfile = () => {
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const {
    data: doctorProfile,
    isLoading,
    isFetching,
  } = useGetMyProfileQuery({});
  const [loading, setLoading] = useState(false);
  const fileUploaderRef = useRef<{ reset: () => void }>();

  const handleFormSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      const {
        name,
        profilePhoto,
        contactNumber,
        registrationNumber,
        experience,
        gender,
        appointmentFee,
        qualification,
        currentWorkingPlace,
        designation,
        file,
      } = values;

      const filteredValues = {
        name,
        profilePhoto,
        contactNumber,
        registrationNumber,
        experience: Number(experience),
        gender,
        appointmentFee: Number(appointmentFee),
        qualification,
        currentWorkingPlace,
        designation,
        file,
      };

      const data = modifyPayload(filteredValues);

      const res = await updateMyProfile(data).unwrap();
      if (res.id) {
        toast.success("Profile updated successfully!");
      }
      fileUploaderRef.current?.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your professional information and personal details
          </p>
        </div>

        <HCForm onSubmit={handleFormSubmit} defaultValues={doctorProfile}>
          <motion.div
            className="space-y-6"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {/* Personal Information Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HCInput
                      label="Full Name"
                      placeholder="Dr. John Doe"
                      name="name"
                      type="text"
                      size="lg"
                      icon={User}
                    />

                    <HCInput
                      label="Contact Number"
                      placeholder="+1 (555) 123-4567"
                      name="contactNumber"
                      type="tel"
                      size="lg"
                      icon={Phone}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HCSelect
                      label="Gender"
                      name="gender"
                      options={genderOptions}
                      placeholder="Select gender"
                      size="lg"
                    />

                    <div className="flex items-end">
                      <HCFileUploader
                        name="file"
                        className="w-full"
                        defaultValue={doctorProfile?.profilePhoto}
                        label="Profile Photo"
                        ref={fileUploaderRef}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Information Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                    <Stethoscope className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HCInput
                      label="Registration Number"
                      placeholder="REG123456789"
                      name="registrationNumber"
                      type="text"
                      size="lg"
                      icon={Award}
                    />

                    <HCInput
                      label="Qualification"
                      placeholder="MBBS, MD"
                      name="qualification"
                      type="text"
                      size="lg"
                      icon={GraduationCap}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HCInput
                      label="Designation"
                      placeholder="Senior Consultant"
                      name="designation"
                      type="text"
                      size="lg"
                      icon={Briefcase}
                    />

                    <HCInput
                      label="Current Working Place"
                      placeholder="City General Hospital"
                      name="currentWorkingPlace"
                      type="text"
                      size="lg"
                      icon={Building2}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Experience & Fees Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-700 dark:text-purple-300">
                    <Calendar className="h-5 w-5" />
                    Experience & Fees
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HCInput
                      label="Years of Experience"
                      placeholder="5"
                      name="experience"
                      type="number"
                      size="lg"
                      icon={BookOpen}
                    />

                    <HCInput
                      label="Appointment Fee ($)"
                      placeholder="150"
                      name="appointmentFee"
                      type="number"
                      size="lg"
                      icon={DollarSign}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="pt-6">
              <Separator className="mb-6" />
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="sm:w-auto w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    type="button"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="sm:w-auto w-full"
                >
                  <Button
                    size="lg"
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </HCForm>
      </motion.div>
    </div>
  );
};

export default EditDoctorProfile;
