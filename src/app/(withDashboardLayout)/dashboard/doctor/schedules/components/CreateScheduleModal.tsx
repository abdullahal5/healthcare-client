"use client";

import { useState, useCallback, useMemo, memo } from "react";
import type { FieldValues } from "react-hook-form";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import HCForm from "@/components/Forms/HCForm";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi";
import { useCreateDoctorScheduleMutation } from "@/redux/api/doctorScheduleApi";
import { toast } from "sonner";

interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  isBooked?: boolean;
  maxCapacity?: number;
  currentBookings?: number;
}

interface CreateScheduleModalProps {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}

// Memoized Schedule Card Component
const ScheduleCard = memo(
  ({
    schedule,
    timeSlot,
    isSelected,
    onToggle,
    isToggling,
  }: {
    schedule: Schedule;
    timeSlot: string;
    isSelected: boolean;
    onToggle: (scheduleId: string) => void;
    isToggling: boolean;
  }) => {
    const isAvailable = !schedule.isBooked;

    const formatDate = useCallback((dateTimeString: string) => {
      return dayjs(dateTimeString).format("MMM DD, YYYY");
    }, []);

    const handleClick = useCallback(() => {
      if (isAvailable && !isToggling) {
        onToggle(schedule.id);
      }
    }, [isAvailable, isToggling, onToggle, schedule.id]);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={isAvailable ? { scale: 1.01 } : {}}
        whileTap={isAvailable ? { scale: 0.99 } : {}}
      >
        <Card
          className={`cursor-pointer mx-4 transition-all duration-200 ${
            isSelected
              ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
              : isAvailable
              ? "hover:shadow-md border-gray-200 hover:border-blue-300"
              : "opacity-50 cursor-not-allowed bg-gray-50"
          } ${isToggling ? "pointer-events-none" : ""}`}
          onClick={handleClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full transition-colors ${
                    isSelected ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {isToggling ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : (
                    <Clock
                      className={`h-4 w-4 ${
                        isSelected ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{timeSlot}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(schedule.startDateTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {schedule.maxCapacity && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {schedule.currentBookings || 0}/{schedule.maxCapacity}
                  </Badge>
                )}

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </motion.div>
                )}

                {!isAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Booked
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

ScheduleCard.displayName = "ScheduleCard";

// Memoized Date Filter Button
const DateFilterButton = memo(
  ({
    dateStr,
    isSelected,
    scheduleCount,
    onClick,
  }: {
    dateStr: string | null;
    isSelected: boolean;
    scheduleCount: number;
    onClick: () => void;
  }) => {
    return (
      <div
        className={`border border-neutral-300 duration-200 rounded-md px-3 py-1 cursor-pointer ${
          isSelected ? "bg-blue-600 text-white" : ""
        }`}
        onClick={onClick}
      >
        {dateStr ? dayjs(dateStr).format("MMM DD") : "All Dates"} (
        {scheduleCount})
      </div>
    );
  }
);

DateFilterButton.displayName = "DateFilterButton";

// Loading Skeleton Component
const LoadingSkeleton = memo(() => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="mx-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

const CreateScheduleModal = ({ open, setOpen }: CreateScheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<Set<string>>(
    new Set()
  );
  const [togglingScheduleId, setTogglingScheduleId] = useState<string | null>(
    null
  );

  interface ScheduleQuery {
    limit: number;
    isDoctorScheduled: boolean;
    startDate?: string;
    endDate?: string;
  }

  const query = useMemo(() => {
    const baseQuery: ScheduleQuery = {
      limit: 1000,
      isDoctorScheduled: false,
    };

    if (selectedDate) {
      baseQuery.startDate = dayjs(selectedDate)
        .hour(0)
        .minute(0)
        .millisecond(0)
        .toISOString();
      baseQuery.endDate = dayjs(selectedDate)
        .hour(23)
        .minute(59)
        .millisecond(999)
        .toISOString();
    }

    return baseQuery;
  }, [selectedDate]);

  const {
    data: schedulesData,
    isLoading,
    isFetching,
    error,
  } = useGetAllSchedulesQuery(query);

  const [createDoctorSchedule, { isLoading: createDoctorScheduleLoading }] =
    useCreateDoctorScheduleMutation();

  // Memoized schedules to prevent unnecessary re-renders
  const schedules = useMemo(() => {
    return schedulesData?.schedules || [];
  }, [schedulesData?.schedules]);

  // Optimized date change handler
  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
    setSelectedScheduleIds(new Set()); // Clear selections when date changes
  }, []);

  // Optimized schedule toggle with loading state
  const handleScheduleToggle = useCallback(async (scheduleId: string) => {
    setTogglingScheduleId(scheduleId);

    // Small delay to show loading state (remove in production if not needed)
    await new Promise((resolve) => setTimeout(resolve, 100));

    setSelectedScheduleIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scheduleId)) {
        newSet.delete(scheduleId);
      } else {
        newSet.add(scheduleId);
      }
      return newSet;
    });

    setTogglingScheduleId(null);
  }, []);

  // Optimized form submission
  const onSubmit = useCallback(
    async (values: FieldValues) => {
      const selectedIds = Array.from(selectedScheduleIds);

      if (selectedIds.length === 0) {
        toast.error("Please select at least one schedule slot");
        return;
      }

      try {
        const res = await createDoctorSchedule({
          scheduleIds: selectedIds,
        });

        if (res.data?.count > 0) {
          toast.success(
            `Successfully created ${res.data.count} doctor schedule(s)!`
          );
          setOpen(false);
          setSelectedScheduleIds(new Set());
          setSelectedDate(null);
        } else {
          toast.warning("No schedules were created");
        }
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Something went wrong!";
        toast.error(errorMessage);
      }
    },
    [selectedScheduleIds, createDoctorSchedule, setOpen]
  );

  // Memoized time formatting
  const formatTime = useCallback((dateTimeString: string) => {
    return dayjs(dateTimeString).format("h:mm A");
  }, []);

  // Optimized available dates calculation
  const availableDates = useMemo(() => {
    const dateSet = new Set<string>();
    schedules.forEach((schedule) => {
      dateSet.add(dayjs(schedule.startDateTime).format("YYYY-MM-DD"));
    });
    return Array.from(dateSet).sort();
  }, [schedules]);

  // Optimized schedules by date grouping
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, Schedule[]> = {};
    schedules.forEach((schedule) => {
      const dateKey = dayjs(schedule.startDateTime).format("YYYY-MM-DD");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });
    return grouped;
  }, [schedules]);

  // Optimized grouped schedules for display
  const groupedSchedules = useMemo(() => {
    const schedulesToShow = selectedDate
      ? schedulesByDate[dayjs(selectedDate).format("YYYY-MM-DD")] || []
      : schedules;

    const grouped: { [key: string]: Schedule[] } = {};
    schedulesToShow.forEach((schedule) => {
      const timeKey = `${formatTime(schedule.startDateTime)} - ${formatTime(
        schedule.endDateTime
      )}`;
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(schedule);
    });

    // Sort by time
    const sortedEntries = Object.entries(grouped).sort(([timeA], [timeB]) => {
      const timeAStart = timeA.split(" - ")[0];
      const timeBStart = timeB.split(" - ")[0];
      return dayjs(`2000-01-01 ${timeAStart}`, "YYYY-MM-DD h:mm A").isBefore(
        dayjs(`2000-01-01 ${timeBStart}`, "YYYY-MM-DD h:mm A")
      )
        ? -1
        : 1;
    });

    return Object.fromEntries(sortedEntries);
  }, [schedules, selectedDate, schedulesByDate, formatTime]);

  // Handle modal close
  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedScheduleIds(new Set());
    setSelectedDate(null);
  }, [setOpen]);

  // Error handling
  if (error) {
    return (
      <HCModal open={open} setOpen={setOpen} title="Error" className="max-w-md">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Failed to load schedules</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </HCModal>
    );
  }

  return (
    <HCModal
      open={open}
      setOpen={setOpen}
      width=""
      title="Create Doctor Schedule"
      className="max-w-4xl h-[85vh]"
    >
      <HCForm onSubmit={onSubmit}>
        <div className="space-y-6 h-full flex flex-col">
          {/* Date Filter Buttons */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              <DateFilterButton
                dateStr={null}
                isSelected={!selectedDate}
                scheduleCount={schedules.length}
                onClick={() => handleDateChange(null)}
              />
              {availableDates.map((dateStr) => {
                const date = new Date(dateStr);
                const isSelected =
                  selectedDate &&
                  dayjs(selectedDate).format("YYYY-MM-DD") === dateStr;
                return (
                  <DateFilterButton
                    key={dateStr}
                    dateStr={dateStr}
                    isSelected={!!isSelected}
                    scheduleCount={schedulesByDate[dateStr]?.length || 0}
                    onClick={() => handleDateChange(date)}
                  />
                );
              })}
            </div>

            {selectedDate && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>
                  Showing:{" "}
                  <strong className="text-blue-800">
                    {dayjs(selectedDate).format("MMMM DD, YYYY")}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Schedule Selection */}
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedDate ? "Available Time Slots" : "All Available Slots"}
              </h3>
              {selectedScheduleIds.size > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedScheduleIds.size} selected
                  </Badge>
                </motion.div>
              )}
            </div>

            <ScrollArea className="flex-1 border border-neutral-300 rounded-lg p-2">
              <AnimatePresence mode="wait">
                {isLoading || isFetching ? (
                  <LoadingSkeleton />
                ) : Object.keys(groupedSchedules).length > 0 ? (
                  <div className="space-y-3 pb-4">
                    {Object.entries(groupedSchedules).map(
                      ([timeSlot, scheduleList]) => (
                        <div key={timeSlot} className="space-y-2">
                          {scheduleList.map((schedule) => (
                            <ScheduleCard
                              key={schedule.id}
                              schedule={schedule}
                              timeSlot={timeSlot}
                              isSelected={selectedScheduleIds.has(schedule.id)}
                              onToggle={handleScheduleToggle}
                              isToggling={togglingScheduleId === schedule.id}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      No available slots found
                    </p>
                    <p className="text-sm">
                      {selectedDate
                        ? "Try selecting a different date"
                        : "No schedules available at the moment"}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t bg-white">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={createDoctorScheduleLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              type="submit"
              disabled={
                createDoctorScheduleLoading || selectedScheduleIds.size === 0
              }
            >
              {createDoctorScheduleLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                `Create ${selectedScheduleIds.size} Schedule${
                  selectedScheduleIds.size !== 1 ? "s" : ""
                }`
              )}
            </Button>
          </div>
        </div>
      </HCForm>
    </HCModal>
  );
};

export default CreateScheduleModal;
