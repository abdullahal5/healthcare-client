"use client";

import { getUserInfo } from "@/services/auth.services";
import DoctorProfile from "./_components/DoctorProfile";
import PatientProfile from "./_components/PatientProfile";
import { useSearchParams } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { ProfileSkeleton } from "./_components/ProfileSkeletonLoading";
import AdminProfile from "./_components/AdminProfile";

const Profile = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: userData, isLoading } = useGetSingleUserQuery(id ? { id } : {});

  const info = getUserInfo();
  const role = id ? userData?.role?.toLowerCase() : info?.role;

  if (isLoading) return <ProfileSkeleton />;

  const ownerProfile = info.email === userData.email;


  return (
    <div>
      {role === "doctor" && (
        <DoctorProfile user={userData} ownerProfile={ownerProfile} />
      )}
      {role === "patient" && (
        <PatientProfile user={userData} ownerProfile={ownerProfile} />
      )}
      {role === "admin" && (
        <AdminProfile user={userData} />
      )}
    </div>
  );
};

export default Profile;
