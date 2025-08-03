import { USER_ROLE } from "@/constant/role";
import { UserRole } from "@/types/common";
import {
  Book,
  Calendar,
  DollarSign,
  FileText,
  GroupIcon,
  KeyIcon,
  LayoutDashboard,
  LayoutDashboardIcon,
  LucideIcon,
  PenSquare,
  Trophy,
  User,
} from "lucide-react";

export interface IRoleMenus {
  title: string;
  path: string;
  icon?: LucideIcon;
  child?: IRoleMenus[];
}

export const menuItems = (role: UserRole): IRoleMenus[] => {
  const roleMenus: IRoleMenus[] = [];

  const defaultMenus: IRoleMenus[] = [
    {
      title: "Profile",
      path: `profile`,
      icon: User,
    },
    {
      title: "Change Password",
      path: `change-password`,
      icon: KeyIcon,
    },
  ];

  switch (role) {
    case USER_ROLE.SUPER_ADMIN:
      roleMenus.push(
        {
          title: "Dashboard",
          path: `${role}`,
          icon: LayoutDashboardIcon,
        },
        {
          title: "Manage Users",
          path: `${role}/manage-users`,
          icon: GroupIcon,
        }
      );
      break;

    case USER_ROLE.ADMIN:
      roleMenus.push(
        {
          title: "Dashboard",
          path: `${role}`,
          icon: LayoutDashboard,
        },
        {
          title: "Specialties",
          path: `${role}/specialties`,
          icon: Trophy,
        },
        {
          title: "Doctors",
          path: `${role}/doctors`,
          icon: User,
        },
        // {
        //   title: "Prescriptions",
        //   path: `${role}/prescriptions`,
        //   icon: FileText,
        // },
        {
          title: "Patients",
          path: `${role}/patients`,
          icon: User,
        },
        {
          title: "Schedules",
          path: `${role}/schedules`,
          icon: Calendar,
        },
        {
          title: "Appointments",
          path: `${role}/appointments`,
          icon: Book,
        }
      );
      break;

    case USER_ROLE.DOCTOR:
      roleMenus.push(
        {
          title: "Dashboard",
          path: `${role}`,
          icon: LayoutDashboard,
        },
        {
          title: "Schedules",
          path: `${role}/schedules`,
          icon: Calendar,
        },
        {
          title: "Appointments",
          path: `${role}/appointments`,
          icon: Book,
        }
      );
      break;

    case USER_ROLE.PATIENT:
      roleMenus.push(
        {
          title: "Appointments",
          path: `${role}/appointments`,
          icon: Book,
        },
        {
          title: "Prescriptions",
          path: `${role}/prescriptions`,
          icon: FileText,
        },
        {
          title: "Payment History",
          path: `${role}/payment-history`,
          icon: DollarSign,
        },
        {
          title: "Review",
          path: `${role}/reviews`,
          icon: PenSquare,
        }
      );
      break;

    default:
      break;
  }

  return [...roleMenus, ...defaultMenus];
};
