"use client";

import { getUserInfo } from "@/services/auth.services";
import EditDoctorProfile from "../_components/edit/EditDoctorProfile";
import EditPatientProfile from "../_components/edit/EditPatientProfile";

const Edit = () => {
  const info = getUserInfo();
  return (
    <div>
      {info.role === "doctor" && <EditDoctorProfile />}
      {info.role === "patient" && <EditPatientProfile />}
    </div>
  );
};

export default Edit;
