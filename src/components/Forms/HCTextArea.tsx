"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormLabel } from "../ui/form";
import { TInputProps } from "@/types";
import { Textarea } from "../ui/textarea";

const HCTextArea = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  readOnly,
  rows = 4,
  className = "",
  ...props
}: TInputProps & { rows?: number }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="grid w-full max-w-sm items-start gap-1.5">
          {label && (
            <FormLabel htmlFor={name}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </FormLabel>
          )}
          <Textarea
            {...field}
            id={name}
            value={field.value || ""}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            className={`resize-none border-slate-300 focus-visible:ring-primary/50 ${className}`}
            {...props}
          />
          {error && (
            <span className="text-sm text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default HCTextArea;
