import { LucideIcon } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

export interface Doctor {
  id: string;
  name: string;
  profilePhoto?: string;
  qualification: string;
  designation: string;
  currentWorkingPlace: string;
  experience: number;
  averageRating: number;
  appointmentFee: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "search"
  | "color";

export type TInputProps = {
  name: string;
  label?: string;
  type?: InputType;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  className?: ClassNameValue;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export type TSpecialties = {
  id: string;
  title: string;
  icon: string;
};

export const doctorGender = [
  { value: "MALE", label: "MALE" },
  { value: "FEMALE", label: "FEMALE" },
];
