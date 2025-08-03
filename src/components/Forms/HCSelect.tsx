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
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (value: string | string[]) => void;
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
  onChange,
  group,
  multiple = false,
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
      render={({ field, fieldState: { error } }) => {
        // For multiple: ensure value is an array
        const value = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : field.value || "";

        // Handle toggle for multiple
        const handleToggle = (val: string) => {
          if (!multiple) {
            field.onChange(val);
            onChange?.(val);
            return;
          }
          let newValue = Array.isArray(value) ? [...value] : [];
          if (newValue.includes(val)) {
            newValue = newValue.filter((v) => v !== val);
          } else {
            newValue.push(val);
          }
          field.onChange(newValue);
          onChange?.(newValue);
        };

        // Compose the display text for multiple selected values
        const displayValue = multiple
          ? value.length > 0
            ? options
                .filter((o) => value.includes(o.value))
                .map((o) => o.label)
                .join(", ")
            : placeholder
          : // single select: show label of selected option or placeholder
            options.find((o) => o.value === value)?.label || placeholder;
        return (
          <div className="grid w-full items-center gap-1.5">
            {label && (
              <FormLabel className="mb-1" htmlFor={name}>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FormLabel>
            )}
            <Select disabled={disabled} value={multiple ? undefined : value}>
              {/* 
                For multiple, we do NOT control Select's value,
                because no native multi support. We just open the dropdown.
              */}
              <SelectTrigger
                id={name}
                className={`${sizeClasses[size]} ${className} ${
                  error ? "border-destructive" : "border-slate-300"
                }`}
              >
                {/* Show the display value in the trigger */}
                <span
                  className={
                    multiple && value.length === 0 ? "text-gray-400" : ""
                  }
                >
                  {displayValue}
                </span>
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-auto">
                {group ? (
                  group.map((groupItem, index) => (
                    <SelectGroup key={index}>
                      <SelectLabel className="text-muted-foreground">
                        {groupItem.label}
                      </SelectLabel>
                      {groupItem.options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center gap-2 px-3 py-1 cursor-pointer select-none ${
                            option.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            !option.disabled && handleToggle(option.value)
                          }
                        >
                          {multiple && (
                            <input
                              type="checkbox"
                              checked={value.includes(option.value)}
                              onChange={() => handleToggle(option.value)}
                              disabled={option.disabled}
                            />
                          )}
                          <span>{option.label}</span>
                        </div>
                      ))}
                    </SelectGroup>
                  ))
                ) : (
                  <SelectGroup>
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center gap-2 px-3 py-1 cursor-pointer select-none ${
                          option.disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          !option.disabled && handleToggle(option.value)
                        }
                      >
                        {multiple && (
                          <input
                            type="checkbox"
                            checked={value.includes(option.value)}
                            onChange={() => handleToggle(option.value)}
                            disabled={option.disabled}
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
            {error && (
              <span className="text-sm text-destructive">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
};

export default HCSelect;
