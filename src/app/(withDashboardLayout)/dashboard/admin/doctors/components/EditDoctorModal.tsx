"use client";
import HCFileUploader from "@/components/Forms/HCFileUploader";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCSelect from "@/components/Forms/HCSelect";
import ModalLoadingContent from "@/components/Shared/DashboardUtils/ModalLoadingContent";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Button } from "@/components/ui/button";
import {
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "@/redux/api/doctorApi";
import { containerVariants, itemVariants } from "@/Transition";
import { doctorGender } from "@/types";
import { Doctor } from "@/types/doctor";
import { modifyPayload } from "@/utils/modifyPayload";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  User,
  Phone,
  Home,
  BookOpen,
  Briefcase,
  Award,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const EditDoctorModal = ({
  open,
  setOpen,
  doctorId,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  doctorId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const fileUploaderRef = useRef<{ reset: () => void }>();
  const [updateDoctor] = useUpdateDoctorMutation();
  const {
    data: singleDoctorInfo,
    isLoading,
    isFetching,
  } = useGetDoctorQuery(doctorId, {
    skip: !doctorId,
  });

  const doctorInfo = singleDoctorInfo as Doctor;

  const handleFormSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      values.experience = Number(values.experience);
      values.appointmentFee = Number(values.appointmentFee);

      delete values.email;

      const data = modifyPayload(values);

      const res = await updateDoctor({
        id: doctorInfo?.id,
        data: data,
      }).unwrap();
      if (res.id) {
        toast.success("Doctor updated successfully!");
        setOpen(false);
      }
      fileUploaderRef.current?.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const transformDoctorData = (doctorData: Doctor) => {
    return {
      email: doctorData?.email,
      name: doctorData?.name,
      contactNumber: doctorData?.contactNumber,
      address: doctorData?.address,
      registrationNumber: doctorData?.registrationNumber,
      gender: doctorData?.gender,
      experience: doctorData?.experience,
      appointmentFee: doctorData?.appointmentFee,
      qualification: doctorData?.qualification,
      currentWorkingPlace: doctorData?.currentWorkingPlace,
      designation: doctorData?.designation,
      profilePhoto: doctorData?.profilePhoto,
    };
  };

  return (
    <HCModal width="lg" open={open} setOpen={setOpen} title="Update New Doctor">
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden p-3"
          >
            {isFetching || isLoading ? (
              <ModalLoadingContent />
            ) : (
              <HCForm
                defaultValues={transformDoctorData(doctorInfo)}
                onSubmit={handleFormSubmit}
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                >
                  {/* Personal Information Section */}
                  <motion.div className="md:col-span-2" variants={itemVariants}>
                    <h3 className="text-lg font-semibold text-primary mb-2 border-b pb-1">
                      Personal Information
                    </h3>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Full Name"
                      placeholder="Dr. John Doe"
                      name="name"
                      type="text"
                      size="lg"
                      icon={User}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Email"
                      placeholder="doctor@example.com"
                      name="email"
                      type="email"
                      size="lg"
                      readOnly
                      disabled
                      icon={Mail}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Contact Number"
                      placeholder="+1234567890"
                      name="contactNumber"
                      type="tel"
                      size="lg"
                      icon={Phone}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCSelect
                      label="Gender"
                      name="gender"
                      placeholder="Select gender"
                      size="lg"
                      options={doctorGender}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <HCInput
                      label="Address"
                      placeholder="123 Medical St, Health City"
                      name="address"
                      type="text"
                      size="lg"
                      icon={Home}
                    />
                  </motion.div>

                  {/* Professional Information Section */}
                  <motion.div
                    className="md:col-span-2 mt-4"
                    variants={itemVariants}
                  >
                    <h3 className="text-lg font-semibold text-primary mb-2 border-b pb-1">
                      Professional Information
                    </h3>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Registration Number"
                      placeholder="MED123456"
                      name="registrationNumber"
                      type="text"
                      size="lg"
                      icon={BookOpen}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Experience (Years)"
                      placeholder="5"
                      name="experience"
                      type="number"
                      size="lg"
                      icon={Calendar}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Qualification"
                      placeholder="MD, MBBS, etc."
                      name="qualification"
                      type="text"
                      size="lg"
                      icon={Award}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Current Working Place"
                      placeholder="City Hospital"
                      name="currentWorkingPlace"
                      type="text"
                      size="lg"
                      icon={Briefcase}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Designation"
                      placeholder="Senior Surgeon"
                      name="designation"
                      type="text"
                      size="lg"
                      icon={Briefcase}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <HCInput
                      label="Appointment Fee ($)"
                      placeholder="100"
                      name="appointmentFee"
                      type="number"
                      size="lg"
                      icon={DollarSign}
                    />
                  </motion.div>

                  {/* Account Information Section */}
                  <motion.div
                    className="md:col-span-2 mt-4"
                    variants={itemVariants}
                  >
                    <h3 className="text-lg font-semibold text-primary mb-2 border-b pb-1">
                      Account Information
                    </h3>
                  </motion.div>

                  <motion.div variants={itemVariants} className="md:col-span-2">
                    <HCFileUploader
                      name="file"
                      className="w-full"
                      defaultValue={doctorInfo?.profilePhoto}
                      label="Profile photo"
                      ref={fileUploaderRef}
                    />
                  </motion.div>
                </motion.div>

                <motion.div className="flex gap-4 pt-6" variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full border border-blue-500"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button className="w-full" type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Doctor"}
                    </Button>
                  </motion.div>
                </motion.div>
              </HCForm>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </HCModal>
  );
};

export default EditDoctorModal;
