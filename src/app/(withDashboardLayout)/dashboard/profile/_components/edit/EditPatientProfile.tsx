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
  User,
  Phone,
  MapPin,
  Heart,
  Calendar,
  Ruler,
  Weight,
  Save,
  Loader2,
  ArrowLeft,
  Activity,
  Brain,
  Utensils,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const EditPatientProfile = () => {
  const router = useRouter();
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const {
    data: patientProfile,
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
        address,
        // Health data
        gender,
        dateOfBirth,
        bloodGroup,
        hasAllergies,
        hasDiabetes,
        height,
        weight,
        smokingStatus,
        dietaryPreferences,
        pregnancyStatus,
        mentalHealthHistory,
        immunizationStatus,
        hasPastSurgeries,
        recentAnxiety,
        recentDepression,
        maritalStatus,
        file,
      } = values;

      const filteredValues = {
        name,
        profilePhoto,
        contactNumber,
        address,
        patientHealthData: {
          gender,
          dateOfBirth,
          bloodGroup,
          hasAllergies: hasAllergies === "true",
          hasDiabetes: hasDiabetes === "true",
          height,
          weight,
          smokingStatus: smokingStatus === "true",
          dietaryPreferences,
          pregnancyStatus: pregnancyStatus === "true",
          mentalHealthHistory,
          immunizationStatus,
          hasPastSurgeries: hasPastSurgeries === "true",
          recentAnxiety: recentAnxiety === "true",
          recentDepression: recentDepression === "true",
          maritalStatus,
        },
        file,
      };

      const data = modifyPayload(filteredValues);
      const res = await updateMyProfile(data).unwrap();

      if (res.id) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/profile");
      }

      fileUploaderRef.current?.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Options for select fields matching Prisma enums
  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
  ];

  const bloodGroupOptions = [
    { label: "A+", value: "A_POSITIVE" },
    { label: "A-", value: "A_NEGATIVE" },
    { label: "B+", value: "B_POSITIVE" },
    { label: "B-", value: "B_NEGATIVE" },
    { label: "AB+", value: "AB_POSITIVE" },
    { label: "AB-", value: "AB_NEGATIVE" },
    { label: "O+", value: "O_POSITIVE" },
    { label: "O-", value: "O_NEGATIVE" },
  ];

  const maritalStatusOptions = [
    { label: "Married", value: "MARRIED" },
    { label: "Unmarried", value: "UNMARRIED" },
  ];

  const booleanOptions = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prepare default values
  const defaultValues = {
    ...patientProfile,
    ...patientProfile?.patientHealthData,
    // Convert boolean values to strings for select components
    hasAllergies:
      patientProfile?.patientHealthData?.hasAllergies?.toString() || "false",
    hasDiabetes:
      patientProfile?.patientHealthData?.hasDiabetes?.toString() || "false",
    smokingStatus:
      patientProfile?.patientHealthData?.smokingStatus?.toString() || "false",
    pregnancyStatus:
      patientProfile?.patientHealthData?.pregnancyStatus?.toString() || "false",
    hasPastSurgeries:
      patientProfile?.patientHealthData?.hasPastSurgeries?.toString() ||
      "false",
    recentAnxiety:
      patientProfile?.patientHealthData?.recentAnxiety?.toString() || "false",
    recentDepression:
      patientProfile?.patientHealthData?.recentDepression?.toString() ||
      "false",
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Update your personal and health information
                </p>
              </div>
            </div>

            <HCForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
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
                  <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
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
                          placeholder="John Doe"
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
                      <HCInput
                        label="Address"
                        placeholder="123 Main Street, City, State"
                        name="address"
                        type="text"
                        size="lg"
                        icon={MapPin}
                      />
                      <div className="flex items-end">
                        <HCFileUploader
                          name="file"
                          className="w-full"
                          defaultValue={patientProfile?.profilePhoto}
                          label="Profile Photo"
                          ref={fileUploaderRef}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Basic Health Information */}
                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-red-600 dark:text-red-400">
                        <Heart className="h-5 w-5" />
                        Basic Health Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HCSelect
                          label="Gender"
                          name="gender"
                          options={genderOptions}
                          placeholder="Select gender"
                          size="lg"
                        />
                        <HCInput
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          size="lg"
                          icon={Calendar}
                        />
                        <HCSelect
                          label="Blood Group"
                          name="bloodGroup"
                          options={bloodGroupOptions}
                          placeholder="Select blood group"
                          size="lg"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HCInput
                          label="Height"
                          placeholder="175 cm"
                          name="height"
                          type="text"
                          size="lg"
                          icon={Ruler}
                        />
                        <HCInput
                          label="Weight"
                          placeholder="68 kg"
                          name="weight"
                          type="text"
                          size="lg"
                          icon={Weight}
                        />
                        <HCSelect
                          label="Marital Status"
                          name="maritalStatus"
                          options={maritalStatusOptions}
                          placeholder="Select status"
                          size="lg"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Health Conditions */}
                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-orange-600 dark:text-orange-400">
                        <Activity className="h-5 w-5" />
                        Health Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <HCSelect
                          label="Has Allergies"
                          name="hasAllergies"
                          options={booleanOptions}
                          placeholder="Select option"
                          size="lg"
                        />
                        <HCSelect
                          label="Has Diabetes"
                          name="hasDiabetes"
                          options={booleanOptions}
                          placeholder="Select option"
                          size="lg"
                        />
                        <HCSelect
                          label="Smoking Status"
                          name="smokingStatus"
                          options={booleanOptions}
                          placeholder="Select option"
                          size="lg"
                        />
                        <HCSelect
                          label="Past Surgeries"
                          name="hasPastSurgeries"
                          options={booleanOptions}
                          placeholder="Select option"
                          size="lg"
                        />
                        <HCSelect
                          label="Recent Anxiety"
                          name="recentAnxiety"
                          options={booleanOptions}
                          placeholder="Select option"
                          size="lg"
                        />
                        <HCSelect
                          label="Recent Depression"
                          name="recentDepression"
                          options={booleanOptions}
                          placeholder="Select option"
                          size="lg"
                        />
                      </div>
                      {/* Only show pregnancy status for female patients */}
                      {(patientProfile?.patientHealthData?.gender ===
                        "FEMALE" ||
                        defaultValues?.gender === "FEMALE") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <HCSelect
                            label="Pregnancy Status"
                            name="pregnancyStatus"
                            options={booleanOptions}
                            placeholder="Select option"
                            size="lg"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Additional Information */}
                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm border border-neutral-300 dark:border-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-purple-600 dark:text-purple-400">
                        <Brain className="h-5 w-5" />
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <HCInput
                        label="Dietary Preferences"
                        placeholder="Vegetarian, Vegan, etc."
                        name="dietaryPreferences"
                        type="text"
                        size="lg"
                        icon={Utensils}
                      />
                      <HCInput
                        label="Mental Health History"
                        placeholder="No diagnosed conditions"
                        name="mentalHealthHistory"
                        type="text"
                        size="lg"
                        icon={Brain}
                      />
                      <HCInput
                        label="Immunization Status"
                        placeholder="Up to date"
                        name="immunizationStatus"
                        type="text"
                        size="lg"
                        icon={Activity}
                      />
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
                        className="w-full sm:w-auto bg-transparent"
                        type="button"
                        onClick={() => router.back()}
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
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
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
      </div>
    </>
  );
};

export default EditPatientProfile;
