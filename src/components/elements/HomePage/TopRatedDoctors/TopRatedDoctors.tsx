import { Suspense } from "react";
import DoctorCard from "./TopRatedDoctorCard";

const TopRatedDoctors = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctor?limit=3`,
    {
      next: {
        revalidate: 30,
      },
    }
  );
  const { data: doctors } = await res.json();
  return (
    <>
      <div className="my-3">
        <div
          className="lg:py-44 lg:[clip-path:polygon(0_0,100%_25%,100%_100%,0_75%)]"
          style={{
            backgroundColor: "rgba(20, 20, 20, 0.1)",
          }}
        >
          <div className="container mx-auto px-4 py-10 relative z-10">
            <Suspense fallback={<div>Loading doctors...</div>}>
              <DoctorCard doctors={doctors} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopRatedDoctors;
