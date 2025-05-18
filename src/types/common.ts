import { USER_ROLE } from "@/constant/role";
import { LucideIcon } from "lucide-react";

export type IMeta = {
  page: number;
  limit: number;
  total: number;
};

export type UserRole = keyof typeof USER_ROLE;

export interface IRoleMenus {
  title: string;
  path: string;
  parentPath?: string;
  icon?: LucideIcon;
  child?: IRoleMenus;
}

export type ResponseSuccessType = {
  data: any;
  meta?: IMeta;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
