// app/(withCommonLayout)/doctors/page.tsx
import { Suspense } from "react";
import DoctorContentWithFilter from "./_components/DoctorContentWithFilter";

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <DoctorContentWithFilter />
    </Suspense>
  );
}
