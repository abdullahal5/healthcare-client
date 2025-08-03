"use client";

import HCFileUploader from "@/components/Forms/HCFileUploader";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCSelect from "@/components/Forms/HCSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUpdateDoctorMutation } from "@/redux/api/doctorApi";
import { useGetMyProfileQuery } from "@/redux/api/myProfile";
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi";
import { itemVariants } from "@/Transition";
import { DoctorSpecialties } from "@/types";
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
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const EditDoctorProfile = () => {
  const [updateMyProfile] = useUpdateDoctorMutation();
  const {
    data: doctorProfile,
    isLoading,
    isFetching,
  } = useGetMyProfileQuery({});
  const [loading, setLoading] = useState(false);
  const [removedSpecialties, setRemovedSpecialties] = useState<string[]>([]);
  const fileUploaderRef = useRef<{ reset: () => void }>();

  const { data: specialtiesData, isLoading: specialtyLoading } =
    useGetAllSpecialtiesQuery({});

  const handleFormSubmit = async (values: FieldValues) => {
    setLoading(true);

    const selectedSpecialties = values?.specialties || [];

    const addedSpecialties = selectedSpecialties.map((id: string) => ({
      specialtiesId: id,
    }));

    const deletedSpecialties = removedSpecialties.map((id) => ({
      specialtiesId: id,
      isDeleted: true,
    }));

    const formattedSpecialties = [...addedSpecialties, ...deletedSpecialties];
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
        specialties: formattedSpecialties,
        currentWorkingPlace,
        designation,
        file,
      };

      const data = modifyPayload(filteredValues);

      const res = await updateMyProfile({
        id: doctorProfile?.id,
        data,
      }).unwrap();
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

  const specialtyOptions = specialtiesData?.map(
    (spec: { title: string; id: string; icon: string }) => ({
      label: spec.title,
      value: spec.id,
      icon: spec.icon,
    })
  );

  const selectedSpecialtyIds = new Set(
    doctorProfile?.doctorSpecialties?.map(
      (spec: DoctorSpecialties) => spec?.specialities?.id
    ) || []
  );

  const filteredSpecialtyOptions = specialtyOptions?.filter(
    (option: any) => !selectedSpecialtyIds.has(option.value)
  );

  const handleRemoveSpecialty = (specialtyId: string) => {
    setRemovedSpecialties((prev) => [...prev, specialtyId]);
  };

  if (isLoading || isFetching || specialtyLoading) {
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

            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-700 dark:text-purple-300">
                    <UserCheck className="h-5 w-5" />
                    Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <HCSelect
                        label="Specialties"
                        name="specialties"
                        multiple
                        options={filteredSpecialtyOptions}
                        placeholder="Select a specialty"
                        className="flex-1"
                      />
                    </div>

                    {/* Display selected specialties with remove option */}
                    <div className="flex flex-wrap gap-2">
                      {doctorProfile?.doctorSpecialties
                        ?.filter(
                          (specialty: DoctorSpecialties) =>
                            !removedSpecialties.includes(
                              specialty.specialities.id
                            )
                        )
                        ?.map((specialty: DoctorSpecialties) => (
                          <Badge
                            key={specialty.specialities.id}
                            variant="outline"
                            className="px-3 py-1 rounded-full flex items-center gap-2"
                          >
                            {specialty.specialities.title}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveSpecialty(specialty.specialities.id)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
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
