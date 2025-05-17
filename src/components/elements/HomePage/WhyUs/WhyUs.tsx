"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import chooseUsImg from "@/assets/choose-us.png";
import { useState } from "react";
import { servicesData } from "./cardData";
import { containerVariants, imageVariants, itemVariants } from "@/Transition/whyUs.transition";

const WhyUs = () => {
  const [activeImage, setActiveImage] = useState(chooseUsImg);

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
