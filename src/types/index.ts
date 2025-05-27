import { LucideIcon } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

export interface TDoctor {
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

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum BloodGroup {
  A_POSITIVE = "A_POSITIVE",
  B_POSITIVE = "B_POSITIVE",
  O_POSITIVE = "O_POSITIVE",
  AB_POSITIVE = "AB_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_NEGATIVE = "B_NEGATIVE",
  O_NEGATIVE = "O_NEGATIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
}

export enum MaritalStatus {
  MARRIED = "MARRIED",
  UNMARRIED = "UNMARRIED",
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export type User = {
  id: string;
  email: string;
  role: UserRole;
  password: string;
  lastLogin: Date | null;
  needPasswordChange: boolean;
  loginAttempts: number;
  lockedUntil: Date | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  admin?: Admin;
  doctor?: Doctor;
  patient?: Patient;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  address?: string | null;
  registrationNumber: string;
  experience: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  doctorSpecialties: DoctorSpecialties[];
  doctorSchedules: DoctorSchedules[];
  appointment: Appointment[];
  prescription: Prescription[];
  review: Review[];
};

export type Patient = {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  patientHealthData?: PatientHealthData;
  medicalReport: MedicalReport[];
  appointment: Appointment[];
  prescription: Prescription[];
  review: Review[];
};

export type Specialties = {
  id: string;
  title: string;
  icon: string;
  doctorSpecialties: DoctorSpecialties[];
};

export type DoctorSpecialties = {
  specialtiesId: string;
  doctorId: string;
  specialities: Specialties;
  doctor: Doctor;
};

export type PatientHealthData = {
  id: string;
  patientId: string;
  patient: Patient;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  hasAllergies?: boolean | null;
  hasDiabetes?: boolean | null;
  height: string;
  weight: string;
  smokingStatus?: boolean | null;
  dietaryPreferences?: string | null;
  pregnancyStatus?: boolean | null;
  mentalHealthHistory?: string | null;
  immunizationStatus?: string | null;
  hasPastSurgeries?: boolean | null;
  recentAnxiety?: boolean | null;
  recentDepression?: boolean | null;
  maritalStatus: MaritalStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type MedicalReport = {
  id: string;
  patientId: string;
  patient: Patient;
  reportName: string;
  reportLink: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Schedule = {
  id: string;
  startDateTime: Date;
  endDateTime: Date;
  createdAt: Date;
  updatedAt: Date;
  doctorSchedules: DoctorSchedules[];
  appointment?: Appointment;
};

export type DoctorSchedules = {
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  appointmentId?: string | null;
  doctor: Doctor;
  schedule: Schedule;
  appointment?: Appointment;
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  scheuleId: string;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient;
  doctor: Doctor;
  schedule: Schedule;
  doctorSchedules?: DoctorSchedules;
  payment?: Payment;
  prescription?: Prescription;
  review?: Review;
};

export type Payment = {
  id: string;
  appointmentId: string;
  amount: number;
  transactionId: string;
  status: PaymentStatus;
  paymentGatewayData?: JSON;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
};

export type Prescription = {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
  doctor: Doctor;
  patient: Patient;
};

export type Review = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient;
  doctor: Doctor;
  appointment: Appointment;
};