"use client";

import HCForm from "@/components/Forms/HCForm";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { itemVariants } from "@/Transition";
import HCSelectMultiple from "@/components/Forms/HCMultipleSelect";
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi";
import { DatePicker } from "@/components/Forms/HCDatePicker";
import { parseISO } from "date-fns";
import { useCreateDoctorScheduleMutation } from "@/redux/api/doctorScheduleApi";
import { toast } from "sonner";

const CreateScheduleModal = ({
  open,
  setOpen,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const query: Record<string, any> = {};

  if (!!selectedDate) {
    query["startDate"] = dayjs(selectedDate)
      .hour(0)
      .minute(0)
      .millisecond(0)
      .toISOString();
    query["endDate"] = dayjs(selectedDate)
      .hour(23)
      .minute(59)
      .millisecond(999)
      .toISOString();
  }

  const {
    data: schedulesData,
    isLoading,
    isFetching,
  } = useGetAllSchedulesQuery(query);

  const [createDoctoSchedule, { isLoading: createDoctorScheduleLoading }] =
    useCreateDoctorScheduleMutation();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const onSubmit = async (values: FieldValues) => {
    const scheduleIds = {
      scheduleIds: values?.scheduleIds,
    };
    try {
      if (scheduleIds) {
        const res = await createDoctoSchedule(scheduleIds);
        if (res.data.count > 0) {
          toast.success("Doctor created successfully!");
          setOpen(false);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  console.log(schedulesData?.schedules);

  function getTimeIn12HourFormat(dateTimeString: Date) {
    const date: Date = new Date(dateTimeString);
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const ampm: string = hours >= 12 ? "PM" : "AM";
    const formattedHours: number = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes: string =
      minutes < 10 ? "0" + minutes : minutes.toString();

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const skillOptions = schedulesData?.schedules.map((schedule) => {
    const startDate = new Date(schedule?.startDateTime);
    const endDate = new Date(schedule?.endDateTime);

    return {
      label: `${getTimeIn12HourFormat(startDate)} - ${getTimeIn12HourFormat(
        endDate
      )} (${startDate.toLocaleDateString()})`,
      value: `${schedule.id}`,
    };
  });

  const availableSlotDates = Array.from(
    new Set(
      schedulesData?.schedules?.map((slot: any) =>
        new Date(parseISO(slot?.startDateTime))?.toDateString()
      )
    )
  ).map((dateStr) => new Date(dateStr));

  return (
    <HCModal open={open} setOpen={setOpen} title="Create New Doctor Schedule">
      <HCForm
        defaultValues={{
          scheduleDate: selectedDate
            ? new Date(
                dayjs(selectedDate)
                  .hour(0)
                  .minute(0)
                  .millisecond(0)
                  .toISOString()
              )
            : {},
        }}
        onSubmit={onSubmit}
      >
        <div className="space-y-4">
          <DatePicker
            name="scheduleDate"
            label="Select Date"
            size="lg"
            highLightDates={availableSlotDates}
            onChange={handleDateChange}
          />

          {selectedDate && !isLoading && !isFetching && (
            <p className="text-sm text-gray-600">
              Selected Date:{" "}
              <strong>{dayjs(selectedDate).format("MMMM DD, YYYY")}</strong>,
              found{" "}
              <strong>{schedulesData?.schedules?.length || 0} slots</strong>
            </p>
          )}

          <HCSelectMultiple
            name="scheduleIds"
            label="Select Slots"
            size="lg"
            isLoading={isLoading || isFetching}
            placeholder="Select your slots"
            options={skillOptions}
            multiple
          />

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
              <Button
                className="w-full"
                type="submit"
                disabled={createDoctorScheduleLoading}
              >
                {createDoctorScheduleLoading
                  ? "Creating..."
                  : "Create Doctor Schedule"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </HCForm>
    </HCModal>
  );
};

export default CreateScheduleModal;
