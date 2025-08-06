"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ChevronRight, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { DoctorSchedules, Schedule } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateAppointmentMutation } from "@/redux/api/appointmentApi";
import { useInitialPaymentMutation } from "@/redux/api/paymentApi";
import { toast } from "sonner";

dayjs.extend(utc);
dayjs.extend(timezone);

const DoctorScheduleSlot = ({ id }: { id: string }) => {
  const { data, isLoading, isFetching } = useGetAllDoctorSchedulesQuery({
    doctorId: id,
  });
  const [createAppointment, { isLoading: createAppointmentLoading }] =
    useCreateAppointmentMutation();
  const [initialPayment, { isLoading: initialPaymentLoading }] =
    useInitialPaymentMutation();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Schedule | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const schedules = useMemo(
    () => (data?.doctorSchedules as unknown as DoctorSchedules[]) || [],
    [data]
  );

  // Group schedules by date
  const schedulesByDate: Record<string, Schedule[]> = useMemo(
    () =>
      schedules.reduce((acc, curr) => {
        const date = dayjs(curr.schedule.startDateTime).format("YYYY-MM-DD");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(curr.schedule);
        return acc;
      }, {} as Record<string, Schedule[]>),
    [schedules]
  );

  // Get available dates
  const availableDates = useMemo(
    () => Object.keys(schedulesByDate).sort(),
    [schedulesByDate]
  );

  // Set default selected date to the first available date if not set
  if (availableDates.length > 0 && !selectedDate) {
    setSelectedDate(availableDates[0]);
  }

  // Calendar date modifiers
  const calendarModifiers = {
    available: availableDates.map((date) => new Date(date)),
    today: new Date(),
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("dddd, MMMM D, YYYY");
  };

  const formatTime = (dateString: string) => {
    return dayjs(dateString).format("h:mm A");
  };

  const formatShortDate = (dateString: string) => {
    return dayjs(dateString).format("ddd, MMM D");
  };

  const handleBookAppointment = async () => {
    try {
      if (id && selectedSlot) {
        const res = await createAppointment({
          doctorId: id,
          scheduleId: selectedSlot.id,
        }).unwrap();
        if (res.id) {
          const response = await initialPayment(res.id).unwrap();
          if (response.Url) {
            if (response.Url && typeof window !== "undefined") {
              window.location.replace(response.Url);
            } else {
              toast.error("Payment URL not available or window undefined.");
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const diff = endDate.diff(startDate, "minute");
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${
      minutes > 0 ? `${minutes}m` : ""
    }`.trim();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const dateString = dayjs(date).format("YYYY-MM-DD");
    if (availableDates.includes(dateString)) {
      setSelectedDate(dateString);
      setSelectedSlot(null);
      setCalendarOpen(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          selectedSlot ? "pb-32" : "pb-6"
        )}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-blue-600 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book Your Appointment
          </CardTitle>
          <p className="text-sm text-gray-500">
            Select your preferred date and time for consultation
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Select Date</h3>
            <div className="flex flex-wrap gap-3">
              {availableDates.slice(0, 3).map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  className="flex items-center gap-2 px-4 py-3 border border-neutral-300"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {formatShortDate(date)}
                </Button>
              ))}

              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center border border-neutral-300 gap-2 px-4 py-3"
                    disabled={availableDates.length === 0}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {availableDates.length > 3 ? "More Dates" : "Select Date"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={handleDateSelect}
                    modifiers={calendarModifiers}
                    modifiersClassNames={{
                      available: "font-bold text-blue-600",
                      today: "border border-blue-500",
                    }}
                    className="rounded-md border shadow-md"
                    // disabled={(date) =>
                    //   !availableDates.includes(dayjs(date).format("YYYY-MM-DD"))
                    // }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Available Time Slots
              </h3>
              {selectedDate && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(selectedDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {schedulesByDate[selectedDate]?.length || 0} slots available
                  </p>
                </div>
              )}
            </div>

            {selectedDate && schedulesByDate[selectedDate] ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {schedulesByDate[selectedDate].map((slot: Schedule, index) => {
                  const isBooked = schedules.find(
                    (s) => s.schedule.id === slot.id
                  )?.isBooked;
                  return (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={{ scale: isBooked ? 1 : 1.03 }}
                    >
                      <Button
                        variant={
                          selectedSlot?.id === slot.id ? "default" : "outline"
                        }
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        className={cn(
                          "w-full flex flex-col items-center justify-center border h-16 transition-all relative overflow-hidden",
                          "hover:shadow-md hover:border-blue-300",
                          selectedSlot?.id === slot.id
                            ? "bg-blue-600 hover:bg-blue-700 border-blue-700"
                            : "hover:bg-blue-50 border-neutral-300",
                          isBooked &&
                            "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                        )}
                      >
                        {selectedSlot?.id === slot.id && (
                          <motion.div
                            className="absolute inset-0 bg-blue-700 opacity-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="flex items-center gap-2 z-10">
                          <Clock
                            className={cn(
                              "h-4 w-4",
                              selectedSlot?.id === slot.id
                                ? "text-white"
                                : "text-blue-600"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              selectedSlot?.id === slot.id
                                ? "text-white"
                                : "text-gray-800"
                            )}
                          >
                            {formatTime(slot.startDateTime)}
                          </span>
                          <span
                            className={cn(
                              "mx-1",
                              selectedSlot?.id === slot.id
                                ? "text-blue-200"
                                : "text-gray-400"
                            )}
                          >
                            -
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              selectedSlot?.id === slot.id
                                ? "text-white"
                                : "text-gray-800"
                            )}
                          >
                            {formatTime(slot.endDateTime)}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "text-xs z-10",
                            selectedSlot?.id === slot.id
                              ? "text-blue-100"
                              : "text-gray-500"
                          )}
                        >
                          {isBooked
                            ? "Booked"
                            : calculateDuration(
                                slot.startDateTime,
                                slot.endDateTime
                              ) + " available"}
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 font-medium">
                    {availableDates.length === 0
                      ? "No available appointments"
                      : "No slots available for selected date"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {availableDates.length === 0
                      ? "Please check back later or contact the clinic"
                      : "Please select a different date"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Sticky Booking Summary - Only show when slot is selected */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed border-t border-neutral-300 bottom-0 left-0 right-0 z-50 bg-blue-100/90 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Appointment Summary */}
                <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Appointment Summary
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Date:</span>
                      <p className="text-blue-800 font-semibold">
                        {dayjs(selectedSlot.startDateTime).format(
                          "MMM D, YYYY"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Time:</span>
                      <p className="text-blue-800 font-semibold">
                        {formatTime(selectedSlot.startDateTime)}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">
                        Duration:
                      </span>
                      <p className="text-blue-800 font-semibold">
                        {calculateDuration(
                          selectedSlot.startDateTime,
                          selectedSlot.endDateTime
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Fee:</span>
                      <p className="text-green-600 font-bold text-lg">
                        ${schedules[0]?.doctor.appointmentFee}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <div className="w-full lg:w-auto">
                  <Button
                    onClick={handleBookAppointment}
                    className="w-full lg:w-auto h-14 px-8 text-lg font-semibold shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
                    size="lg"
                    disabled={createAppointmentLoading || initialPaymentLoading}
                  >
                    {createAppointmentLoading || initialPaymentLoading ? (
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
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Confirm Booking - ${schedules[0]?.doctor.appointmentFee}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorScheduleSlot;
