"use client";
import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Controller, useFormContext } from "react-hook-form";
import { FormLabel } from "../ui/form";

type TTimePickerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

export function TimePicker({
  name,
  label,
  placeholder = "Select time",
  className,
  buttonClassName,
  required = false,
  disabled = false,
  size = "md",
}: TTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const { control, setValue } = useFormContext();

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const getButtonSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-8";
      case "lg":
        return "h-10";
      default:
        return "h-9";
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const [hour = "00", minute = "00"] = field.value?.split(":") || [];

        const handleHourSelect = (selectedHour: string) => {
          const newValue = `${selectedHour}:${minute}`;
          setValue(name, newValue, { shouldValidate: true });
        };

        const handleMinuteSelect = (selectedMinute: string) => {
          const newValue = `${hour}:${selectedMinute}`;
          setValue(name, newValue, { shouldValidate: true });
        };

        const handleOk = () => {
          setOpen(false);
        };

        const displayValue = field.value || placeholder;

        return (
          <div className={cn("grid w-full items-center gap-1.5", className)}>
            {label && (
              <FormLabel className="mb-1" htmlFor={name}>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id={name}
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                  }}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    open && "ring-2 ring-primary/50",
                    getButtonSizeClass(),
                    buttonClassName
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {displayValue}
                </Button>
              </PopoverTrigger>
              {open && (
                <PopoverContent
                  className="w-auto p-0 bg-background z-[1000]"
                  align="start"
                  onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[role="dialog"]')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden rounded-lg border shadow-lg"
                  >
                    <div className="p-3">
                      <div className="flex gap-4 mb-3">
                        {/* Hours Column */}
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-center mb-2 px-2">
                            Hour
                          </div>
                          <div
                            className="max-h-[180px] overflow-y-auto border rounded-md"
                            style={{
                              scrollbarWidth: "thin",
                              WebkitOverflowScrolling: "touch",
                            }}
                          >
                            {hours.map((h) => (
                              <div
                                key={h}
                                className={cn(
                                  "px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground text-center min-w-[50px] transition-colors rounded-md",
                                  hour === h &&
                                    "bg-primary text-primary-foreground",
                                  disabled && "cursor-not-allowed opacity-50"
                                )}
                                onClick={(e) => {
                                  if (disabled) return;
                                  e.stopPropagation();
                                  handleHourSelect(h);
                                }}
                              >
                                {h}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Minutes Column */}
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-center mb-2 px-2">
                            Minute
                          </div>
                          <div
                            className="max-h-[180px] overflow-y-auto border rounded-md"
                            style={{
                              scrollbarWidth: "thin",
                              WebkitOverflowScrolling: "touch",
                            }}
                          >
                            {minutes.map((m) => (
                              <div
                                key={m}
                                className={cn(
                                  "px-3 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md text-center min-w-[50px] transition-colors",
                                  minute === m &&
                                    "bg-primary text-primary-foreground",
                                  disabled && "cursor-not-allowed opacity-50"
                                )}
                                onClick={(e) => {
                                  if (disabled) return;
                                  e.stopPropagation();
                                  handleMinuteSelect(m);
                                }}
                              >
                                {m}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2 border-t">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOk();
                          }}
                          size="sm"
                          disabled={disabled}
                        >
                          OK
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </PopoverContent>
              )}
            </Popover>
            {error && (
              <span className="text-red-500 text-sm">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
}
