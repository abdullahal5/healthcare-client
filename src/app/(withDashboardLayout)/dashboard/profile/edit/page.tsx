"use client";

import { getUserInfo } from "@/services/auth.services";
import EditDoctorProfile from "../_components/edit/EditDoctorProfile";
import EditPatientProfile from "../_components/edit/EditPatientProfile";
import EditAdminProfile from "../_components/edit/EditAdminProfile";

const Edit = () => {
  const info = getUserInfo();
  return (
    <div>
      {info.role === "doctor" && <EditDoctorProfile />}
      {info.role === "patient" && <EditPatientProfile />}
      {info.role === "admin" && <EditAdminProfile />}
    </div>
  );
};

export default Edit;
