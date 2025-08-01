"use client";
import { AnimatePresence, motion } from "framer-motion";
import { User, FileText } from "lucide-react";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { containerVariants, itemVariants } from "@/Transition";
import { useUpdatePatientMutation } from "@/redux/api/patientApi";
import { Button } from "@/components/ui/button";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCFileUploader from "@/components/Forms/HCFileUploader";
import { FieldValues } from "react-hook-form";
import { useRef } from "react";
import { modifyPayload } from "@/utils/modifyPayload";
import { toast } from "sonner";

const ReportModal = ({
  open,
  setOpen,
  id,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  id: string;
}) => {
  const [updatePatient, { isLoading }] = useUpdatePatientMutation();
  const fileUploaderRef = useRef<{ reset: () => void }>();

  const defaultValues = {
    patientId: id,
  };

  const handleFormSubmit = async (values: FieldValues) => {
    try {
      const data = modifyPayload(values);
      const res = await updatePatient({
        id,
        data,
      }).unwrap();
      if (res.id) {
        toast.success("Doctor created successfully!");
        setOpen(false);
      }
      fileUploaderRef.current?.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setOpen(false);
    }
  };

  return (
    <HCModal width="" open={open} setOpen={setOpen} title="Add Medical Report">
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
                className="grid grid-cols-1 gap-4"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1,
                    },
                  },
                }}
              >
                {/* Patient Information */}
                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Patient ID"
                    name="patientId"
                    type="text"
                    size="lg"
                    icon={User}
                    disabled
                  />
                </motion.div>

                {/* Report Information */}
                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Report Name"
                    placeholder="Blood Test Report"
                    name="reportName"
                    type="text"
                    size="lg"
                    icon={FileText}
                    required
                  />
                </motion.div>

                {/* File Upload */}
                <motion.div variants={itemVariants}>
                  <HCFileUploader
                    name="file"
                    className="w-full"
                    label="Upload Report"
                    accept=".jpg,.jpeg,.png"
                    ref={fileUploaderRef}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPG, PNG
                  </p>
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
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Uploading..." : "Upload Report"}
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

export default ReportModal;
