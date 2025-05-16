import HeroSection from "@/components/elements/HomePage/HeroSection";
import Specialist from "@/components/elements/HomePage/Specialist/Specialtist";
import TopRatedDoctors from "@/components/elements/HomePage/TopRatedDoctors/TopRatedDoctors";
import WhyUs from "@/components/elements/HomePage/WhyUs/WhyUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Specialist />
      <TopRatedDoctors />
      <WhyUs />
    </>
  );
}
