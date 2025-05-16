import HeroSection from "@/components/elements/HomePage/HeroSection";
import Specialist from "@/components/elements/HomePage/Specialist/Specialtist";
import TopRatedDoctors from "@/components/elements/HomePage/TopRatedDoctors/TopRatedDoctors";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Specialist />
      <TopRatedDoctors />
    </>
  );
}
