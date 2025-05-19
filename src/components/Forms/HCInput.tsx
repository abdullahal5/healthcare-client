"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { FormLabel } from "../ui/form";
import { TInputProps } from "@/types";

const HCInput = ({
  name,
  label,
  type = "text",
  size = "md",
  placeholder,
  className = "border-slate-300 focus-visible:ring-primary/50",
  icon: Icon,
  required,
  disabled,
  readOnly,
  ...props
}: TInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            {label && (
              <FormLabel className="mb-1" htmlFor={name}>
                {label}
                {required && <span className="text-destructive"> *</span>}
              </FormLabel>
            )}
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                {...field}
                value={field.value || ""}
                type={inputType}
                id={name}
                placeholder={placeholder}
                className={`pl-10 border-slate-300 focus-visible:ring-primary/50 ${
                  size === "sm" ? "h-8" : size === "lg" ? "h-10" : "h-9"
                } ${className} ${type === "password" ? "pr-10" : ""} ${
                  Icon ? "pl-10" : ""
                }`}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                {...props}
              />
              {type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              )}
            </div>
            {error && (
              <span className="text-red-500 text-sm">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
};

export default HCInput;
