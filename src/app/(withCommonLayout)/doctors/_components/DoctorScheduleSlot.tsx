"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DoctorSchedules, Schedule } from "@/types";
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

          if (response.paymentUrl) {
            if (response.paymentUrl && typeof window !== "undefined") {
              window.location.replace(response.paymentUrl);
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

  //   TODO: Here works still remaining
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    console.log(date);
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-12 bg-slate-200 rounded col-span-1"></div>
                <div className="h-12 bg-slate-200 rounded col-span-1"></div>
                <div className="h-12 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-48 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-600">Book Appointment</CardTitle>
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

          <Separator />

          {/* Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">
                Available Time Slots
              </h3>
              {selectedDate && (
                <p className="text-sm text-gray-600">
                  {formatDate(selectedDate)}
                </p>
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
              <div className="text-center py-8 space-y-2">
                <p className="text-gray-500">
                  {availableDates.length === 0
                    ? "No available time slots for this doctor"
                    : "No available time slots for the selected date"}
                </p>
                {availableDates.length === 0 && (
                  <Button variant="ghost" className="text-blue-600">
                    Check back later
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
        {selectedSlot && (
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-lg bg-blue-50 p-4 border border-blue-100"
            >
              <h4 className="font-semibold text-blue-900">
                Appointment Summary
              </h4>
              <div className="mt-2 space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Doctor:</span>
                  <span className="font-medium">
                    {schedules[0]?.doctor.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedSlot.startDateTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">
                    {formatTime(selectedSlot.startDateTime)} to{" "}
                    {formatTime(selectedSlot.endDateTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Consultation Fee:</span>
                  <span className="font-medium">
                    ${schedules[0]?.doctor.appointmentFee}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full"
            >
              <Button
                onClick={handleBookAppointment}
                className="w-full h-14 text-lg font-semibold shadow-lg bg-blue-600 hover:bg-blue-700"
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
                  `Confirm Booking - $${schedules[0]?.doctor.appointmentFee}`
                )}
              </Button>
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DoctorScheduleSlot;
