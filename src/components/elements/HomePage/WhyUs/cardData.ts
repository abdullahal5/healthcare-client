import awardImg from "@/assets/images/award-service.jpg.jpg";
import pregnancyImg from "@/assets/images/pregnancy.jpg";
import equipmentImg from "@/assets/images/equipment.jpg";
import emergencyImg from "@/assets/images/emergency.jpg";
import assets from "@/assets";

export const servicesData = [
  {
    imageSrc: assets.svgs.award,
    title: "Award Winning Service",
    description: "Exceptional service recognized by industry awards",
    hoverImage: awardImg,
  },
  {
    imageSrc: assets.svgs.care,
    title: "Best Quality Pregnancy Care",
    description: "Comprehensive care for expecting mothers",
    hoverImage: pregnancyImg,
  },
  {
    imageSrc: assets.svgs.equipment,
    title: "Complete Medical Equipment",
    description: "State-of-the-art medical technology",
    hoverImage: equipmentImg,
  },
  {
    imageSrc: assets.svgs.call,
    title: "Dedicated Emergency Care",
    description: "24/7 emergency services",
    hoverImage: emergencyImg,
  },
];