"use client";
import { DatePicker } from "@/components/Forms/HCDatePicker";
import HCForm from "@/components/Forms/HCForm";
import { TimePicker } from "@/components/Forms/HCTimePicker";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Button } from "@/components/ui/button";
import { useCreateScheduleMutation } from "@/redux/api/scheduleApi";
import { containerVariants, itemVariants } from "@/Transition";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const CreateScheduleModal = ({
  open,
  setOpen,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [createSchedule] = useCreateScheduleMutation();

  const onSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      const formattedData = {
        startDate: values.startDate
          ? format(values.startDate, "yyyy-MM-dd")
          : null,
        endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
        startTime: values.startTime,
        endTime: values.endTime,
      };

      const res = await createSchedule(formattedData);
      if (res.data) {
        toast.success("Schedules created successfully!");
        setOpen(false);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HCModal width="lg" open={open} setOpen={setOpen} title="Create Schedule">
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden p-3"
          >
            <HCForm onSubmit={onSubmit}>
              <div className="flex items-center gap-3">
                <DatePicker size="lg" name={"startDate"} label="Start Date" />
                <DatePicker size="lg" name={"endDate"} label="End Date" />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <TimePicker size="lg" name={"startTime"} label="Start Time" />
                <TimePicker size="lg" name={"endTime"} label="End Time" />
              </div>

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
                    {loading ? "Creating..." : "Create Schedule"}
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

export default CreateScheduleModal;
