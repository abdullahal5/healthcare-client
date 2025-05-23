"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormLabel } from "../ui/form";
import { ChevronDown } from "lucide-react";

type TOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type HCSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options: TOption[];
  size?: "sm" | "md" | "lg";
  className?: string;
  required?: boolean;
  disabled?: boolean;
  group?: {
    label: string;
    options: TOption[];
  }[];
};

const HCSelect = ({
  name,
  label,
  placeholder = "Select an option",
  options,
  size = "md",
  className = "",
  required,
  disabled,
  group,
}: HCSelectProps) => {
  const { control } = useFormContext();

  const sizeClasses = {
    sm: "h-8 py-1 text-sm",
    md: "h-9 py-2 text-base",
    lg: "h-10 py-2 text-base",
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="grid w-full items-center gap-1.5">
          {label && (
            <FormLabel className="mb-1" htmlFor={name}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={`${sizeClasses[size]} ${className} ${
                error ? "border-destructive" : "border-slate-300"
              }`}
            >
              <SelectValue placeholder={placeholder} />
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {group ? (
                group.map((groupItem, index) => (
                  <SelectGroup key={index}>
                    <SelectLabel className="text-muted-foreground">
                      {groupItem.label}
                    </SelectLabel>
                    {groupItem.options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              ) : (
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          {error && (
            <span className="text-sm text-destructive">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default HCSelect;
