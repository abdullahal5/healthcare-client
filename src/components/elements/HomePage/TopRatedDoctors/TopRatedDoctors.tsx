import { Suspense } from "react";
import TopRatedDoctorCard from "./TopRatedDoctorCard";

const TopRatedDoctors = async () => {
  const res = await fetch(
    "https://healthcare-server-pi.vercel.app/api/v1/doctor?limit=3",
    {
      next: {
        revalidate: 30,
      },
    }
  );
  const { data: doctors } = await res.json();
  return (
    <>
      <div className=" my-3 py-7">
        <div
          className="py-36"
          style={{
            backgroundColor: "rgba(20, 20, 20, 0.1)",
            clipPath: "polygon(0 0, 100% 25%, 100% 100%, 0 75%)",
          }}
        >
          <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <Suspense fallback={<div>Loading doctors...</div>}>
            <TopRatedDoctorCard doctors={doctors} />
          </Suspense>
        </div>
        </div>

      </div>
    </>
  );
};

export default TopRatedDoctors;
