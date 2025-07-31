"use client";

import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCTextArea from "@/components/Forms/HCTextArea";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Button } from "@/components/ui/button";
import {
  useCreatePrescriptionMutation,
  useGetPrescriptionByAppointmentQuery,
  useUpdatePrescriptionMutation,
} from "@/redux/api/prescriptionApi";
import { containerVariants, itemVariants } from "@/Transition";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const CreatePrescriptionModal = ({
  open,
  setOpen,
  appointmentId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  appointmentId: string | null;
}) => {
  const [defaultValues, setDefaultValues] = useState({
    appointmentId: appointmentId || "",
    instructions: "",
  });

  const {
    data: existingPrescription,
    isLoading: isFetchingPrescription,
    isError,
  } = useGetPrescriptionByAppointmentQuery(appointmentId!, {
    skip: !appointmentId || !open,
  });

  const [createPrescription, { isLoading: isCreating }] =
    useCreatePrescriptionMutation();
  const [updatePrescription, { isLoading: isUpdating }] =
    useUpdatePrescriptionMutation();

  useEffect(() => {
    if (open && appointmentId) {
      setDefaultValues((prev) => ({
        ...prev,
        appointmentId: appointmentId,
        instructions: isError ? "" : existingPrescription?.instructions || "",
      }));
    }
  }, [open, appointmentId, existingPrescription, isError]);

  const handleFormSubmit = async (values: FieldValues) => {
    try {
      const payload = {
        appointmentId: values.appointmentId,
        instructions: values.instructions,
      };

      const res = existingPrescription?.id
        ? await updatePrescription({
            id: existingPrescription.id,
            data: payload,
          }).unwrap()
        : await createPrescription(payload).unwrap();

      if (res.id) {
        toast.success(
          existingPrescription?.id
            ? "Prescription updated successfully!"
            : "Prescription created successfully!"
        );
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <HCModal
      width="md"
      open={open}
      setOpen={setOpen}
      title={
        existingPrescription ? "Update Prescription" : "Create Prescription"
      }
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 p-3"
          >
            <HCForm
              key={defaultValues.appointmentId}
              defaultValues={defaultValues}
              onSubmit={handleFormSubmit}
            >
              <motion.div className="space-y-4 w-full">
                {/* Appointment ID */}
                <motion.div className="w-full" variants={itemVariants}>
                  <HCInput
                    label="Appointment ID"
                    name="appointmentId"
                    className="w-full"
                    type="text"
                    disabled
                    size="lg"
                    icon={Hash}
                  />
                </motion.div>

                {/* Instructions - Always shown, empty if loading failed */}
                <motion.div className="w-full" variants={itemVariants}>
                  <HCTextArea
                    label="Medical Instructions*"
                    name="instructions"
                    className="w-full"
                    placeholder={
                      isFetchingPrescription
                        ? "Loading instructions..."
                        : "Enter detailed prescription instructions..."
                    }
                    rows={5}
                    size="lg"
                    icon={FileText}
                    disabled={isFetchingPrescription}
                  />
                  {isError && (
                    <p className="text-sm text-gray-500 mt-1">
                      Could not load existing prescription. You can create a new
                      one.
                    </p>
                  )}
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
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading || isFetchingPrescription}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : existingPrescription ? (
                      "Update Prescription"
                    ) : (
                      "Create Prescription"
                    )}
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

export default CreatePrescriptionModal;
