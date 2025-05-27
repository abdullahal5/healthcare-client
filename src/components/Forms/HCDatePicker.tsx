"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormLabel } from "../ui/form";

type TDatePickerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
};

export function DatePicker({
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  className,
  required = false,
  size = "md",
}: TDatePickerProps) {
  const { control } = useFormContext();

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
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("grid w-full gap-1.5", className)}>
          {label && (
            <FormLabel htmlFor={name}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                  getButtonSizeClass(),
                )}
                disabled={disabled}
                id={name}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(field.value, "PPP") : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-auto p-0 bg-white"
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {error && (
            <span className="text-red-500 text-sm">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
