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
import { X, ChevronDown, Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type TOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type TGroup = {
  label: string;
  options: TOption[];
};

type HCSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options?: TOption[];
  size?: "sm" | "md" | "lg";
  className?: string;
  required?: boolean;
  disabled?: boolean;
  group?: TGroup[];
  multiple?: boolean;
  isLoading?: boolean;
};

const HCSelectMultiple = ({
  name,
  label,
  placeholder = "Select an option",
  options = [],
  size = "md",
  className = "",
  required,
  disabled,
  group = [],
  multiple = false,
  isLoading,
}: HCSelectProps) => {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: "h-8 py-1 text-sm",
    md: "h-9 py-2 text-base",
    lg: "h-10 py-2 text-base",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : [field.value].filter(Boolean);

        const handleSelect = (value: string) => {
          if (multiple) {
            const newValue = selectedValues.includes(value)
              ? selectedValues.filter((v) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValue);
          } else {
            field.onChange(value);
            setIsOpen(false);
          }
        };

        const removeItem = (value: string) => {
          if (multiple) {
            const newValue = selectedValues.filter((v) => v !== value);
            field.onChange(newValue);
          }
        };

        const allOptions = [...options, ...group.flatMap((g) => g.options)];

        // If not multiple, use regular shadcn Select
        if (!multiple) {
          return (
            <div className="grid w-full items-center gap-1.5">
              {label && (
                <FormLabel className="mb-1" htmlFor={name}>
                  {label}
                  {required && <span className="text-destructive"> *</span>}
                </FormLabel>
              )}

              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <Select
                  onValueChange={handleSelect}
                  value={field.value}
                  disabled={disabled}
                  name={name}
                >
                  <SelectTrigger
                    id={name}
                    className={cn(
                      sizeClasses[size],
                      className,
                      error ? "border-destructive" : "border-slate-300"
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {group.length > 0 ? (
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
              )}
              {error && (
                <span className="text-sm text-destructive">
                  {error.message}
                </span>
              )}
            </div>
          );
        }

        // Custom multiple select implementation
        return (
          <div className="grid w-full items-center gap-1.5">
            {label && (
              <FormLabel className="mb-1" htmlFor={name}>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FormLabel>
            )}

            {/* Display selected items as chips when multiple */}
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedValues.map((value) => {
                  const option = allOptions.find((opt) => opt.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="outline"
                      className="flex items-center gap-1 py-1 px-2"
                    >
                      {option?.label || value}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(value);
                        }}
                        className="ml-1 rounded-full hover:bg-gray-100"
                        aria-label={`Remove ${option?.label || value}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Custom Select Trigger */}
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  sizeClasses[size],
                  className,
                  error ? "border-destructive" : "border-slate-300"
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
              >
                <div className="truncate">
                  {selectedValues.length === 0
                    ? placeholder
                    : `${selectedValues.length} selected`}
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 opacity-50 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Custom Dropdown Content */}
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 mt-1 w-full rounded-md border bg-white p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
                  role="listbox"
                >
                  <div className="max-h-60 overflow-auto">
                    {group.length > 0
                      ? group.map((groupItem, index) => (
                          <div key={index}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {groupItem.label}
                            </div>
                            {groupItem.options.map((option) => (
                              <div
                                key={option.value}
                                onClick={() =>
                                  !option.disabled && handleSelect(option.value)
                                }
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                                  option.disabled
                                    ? "pointer-events-none opacity-50"
                                    : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                )}
                                role="option"
                                aria-selected={selectedValues.includes(
                                  option.value
                                )}
                              >
                                <div className="flex items-center w-full">
                                  <div className="flex items-center justify-center w-4 h-4 mr-2 border border-primary rounded-sm">
                                    {selectedValues.includes(option.value) && (
                                      <Check className="h-3 w-3 text-primary" />
                                    )}
                                  </div>
                                  {option.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      : options.map((option) => (
                          <div
                            key={option.value}
                            onClick={() =>
                              !option.disabled && handleSelect(option.value)
                            }
                            className={cn(
                              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                              option.disabled
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                            role="option"
                            aria-selected={selectedValues.includes(
                              option.value
                            )}
                          >
                            <div className="flex items-center w-full">
                              <div className="flex items-center justify-center w-4 h-4 mr-2 border border-primary rounded-sm">
                                {selectedValues.includes(option.value) && (
                                  <Check className="h-3 w-3 text-primary" />
                                )}
                              </div>
                              {option.label}
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <span className="text-sm text-destructive">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
};

export default HCSelectMultiple;
