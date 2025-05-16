"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import assets from "@/assets";
import chooseUsImg from "@/assets/choose-us.png";
import awardImg from "@/assets/images/award-service.jpg.jpg";
import pregnancyImg from "@/assets/images/pregnancy.jpg";
import equipmentImg from "@/assets/images/equipment.jpg";
import emergencyImg from "@/assets/images/emergency.jpg";
import { useState } from "react";

const servicesData = [
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

const WhyUs = () => {
  const [activeImage, setActiveImage] = useState(chooseUsImg);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="text-center mb-12">
          <motion.p
            variants={itemVariants}
            className="text-primary font-semibold text-lg mb-2"
          >
            Why Us
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900"
          >
            Why Choose Us
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            {servicesData.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`flex gap-4 p-4 cursor-pointer bg-gray-50 rounded-lg items-center ${
                  index % 2 === 0 ? "rounded-tr-[100px]" : "rounded-tl-[100px]"
                }`}
                onMouseEnter={() => setActiveImage(service.hoverImage)}
                onMouseLeave={() => setActiveImage(chooseUsImg)}
              >
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Image
                    src={service.imageSrc}
                    width={50}
                    height={50}
                    alt={service.title}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center relative h-[500px]"
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage.src}
                initial="enter"
                animate="center"
                exit="exit"
                variants={imageVariants}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex justify-center"
              >
                <Image
                  src={activeImage}
                  width={500}
                  height={500}
                  alt="Service preview"
                  className="rounded-lg object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WhyUs;
