import { Suspense } from "react";
import SpecialistCard from "./SpecialistCard";

const SpecialistSkeleton = () => (
  <div className="container mx-auto py-16 px-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow-lg">
    <div className="mb-12 text-center">
      <div className="h-10 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
    <div className="text-center">
      <div className="inline-block h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

const Specialist = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/specialties`,
    {
      next: {
        revalidate: 30,
      },
    }
  );
  const { data: specialties } = await res.json();

  return (
    <Suspense fallback={<SpecialistSkeleton />}>
      <SpecialistCard specialties={specialties} />
    </Suspense>
  );
};

export default Specialist;
