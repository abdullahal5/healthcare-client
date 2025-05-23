"use client";
import HCFileUploader from "@/components/Forms/HCFileUploader";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCSelect from "@/components/Forms/HCSelect";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Button } from "@/components/ui/button";
import { useCreateDoctorMutation } from "@/redux/api/doctorApi";
import { containerVariants, itemVariants } from "@/Transition";
import { doctorGender } from "@/types";
import { modifyPayload } from "@/utils/modifyPayload";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Mail,
  User,
  Phone,
  Home,
  BookOpen,
  Briefcase,
  Award,
  DollarSign,
  Calendar,
  Key,
} from "lucide-react";
import { useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const CreateDoctorModal = ({
  open,
  setOpen,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const fileUploaderRef = useRef<{ reset: () => void }>();
  const [createDoctor] = useCreateDoctorMutation();

  const handleFormSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      values.doctor.experience = Number(values.doctor.experience);
      values.doctor.appointmentFee = Number(values.doctor.appointmentFee);
      const data = modifyPayload(values);
      const res = await createDoctor(data).unwrap();
      if (res.id) {
        toast.success("Doctor created successfully!");
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

  const defaultValues = {
    doctor: {
      email: "",
      name: "",
      contactNumber: "",
      address: "",
      registrationNumber: "",
      gender: "",
      experience: 0,
      appointmentFee: 0,
      qualification: "",
      currentWorkingPlace: "",
      designation: "",
    },
    password: "12345678",
  };

  return (
    <HCModal width="lg" open={open} setOpen={setOpen} title="Create New Doctor">
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden p-3"
          >
            <HCForm defaultValues={defaultValues} onSubmit={handleFormSubmit}>
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
                    name="doctor.name"
                    type="text"
                    size="lg"
                    icon={User}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Email"
                    placeholder="doctor@example.com"
                    name="doctor.email"
                    type="email"
                    size="lg"
                    icon={Mail}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Contact Number"
                    placeholder="+1234567890"
                    name="doctor.contactNumber"
                    type="tel"
                    size="lg"
                    icon={Phone}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCSelect
                    label="Gender"
                    name="doctor.gender"
                    placeholder="Select gender"
                    size="lg"
                    options={doctorGender}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                  <HCInput
                    label="Address"
                    placeholder="123 Medical St, Health City"
                    name="doctor.address"
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
                    name="doctor.registrationNumber"
                    type="text"
                    size="lg"
                    icon={BookOpen}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Experience (Years)"
                    placeholder="5"
                    name="doctor.experience"
                    type="number"
                    size="lg"
                    icon={Calendar}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Qualification"
                    placeholder="MD, MBBS, etc."
                    name="doctor.qualification"
                    type="text"
                    size="lg"
                    icon={Award}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Current Working Place"
                    placeholder="City Hospital"
                    name="doctor.currentWorkingPlace"
                    type="text"
                    size="lg"
                    icon={Briefcase}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Designation"
                    placeholder="Senior Surgeon"
                    name="doctor.designation"
                    type="text"
                    size="lg"
                    icon={Briefcase}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Appointment Fee ($)"
                    placeholder="100"
                    name="doctor.appointmentFee"
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
                  <HCInput
                    label="Password"
                    placeholder="Create a strong password"
                    name="password"
                    type="password"
                    size="lg"
                    icon={Key}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                  <HCFileUploader
                    name="file"
                    className="w-full"
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
                    {loading ? "Creating..." : "Create Doctor"}
                  </Button>
                </motion.div>
              </motion.div>
            </HCForm>
          </motion.div>
        )}
      </AnimatePresence>
    </HCModal>
  );
};

export default CreateDoctorModal;
