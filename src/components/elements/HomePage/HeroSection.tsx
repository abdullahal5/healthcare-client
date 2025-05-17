"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import assets from "@/assets";
import { arrowVariant, container, imageContainer, imageItem, item } from "@/Transition/heroSection.transition";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-20 overflow-hidden h-full">
      <div className="container mx-auto h-full px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2 w-full"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              className="text-4xl md:text-7xl font-bold text-gray-900 mb-6"
              variants={item}
            >
              Healthier Hearts Come From{" "}
              <span className="text-[#1586FD]">Preventive Care</span>
            </motion.h1>

            <motion.p className="text-lg text-gray-600 mb-8" variants={item}>
              Comprehensive healthcare solutions tailored to your needs. Our
              expert team is dedicated to your wellbeing with personalized
              treatment plans and continuous support.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={item}
            >
              <Button className="bg-[#1586FD] hover:bg-[#0e6cd0] text-white px-6 py-7 rounded-lg transition-colors duration-300">
                Book Appointment
              </Button>
              <Button
                variant="outline"
                className="text-[#1586FD] hover:bg-blue-50 px-6 border border-neutral-500/70 py-7 rounded-lg transition-colors duration-300"
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 lg:relative md:relative lg:h-[500px] w-full h-auto"
            initial="hidden"
            animate="show"
            variants={imageContainer}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={arrowVariant}
              className="lg:block md:block hidden"
              style={{ position: "absolute", left: 100, top: -40, zIndex: 20 }}
            >
              <Image
                src={assets.svgs.arrow}
                width={100}
                height={100}
                alt="arrow"
              />
            </motion.div>

            <motion.div
              className="lg:absolute inset-0 flex flex-col justify-center lg:flex-row gap-4"
              variants={imageItem}
            >
              <div className="mt-10 lg:mx-0 md:mx-0 mx-auto">
                <Image
                  src={assets.images.doctor1}
                  width={240}
                  height={380}
                  alt="doctor1"
                  className="object-cover"
                />
              </div>
              <div>
                <Image
                  src={assets.images.doctor2}
                  width={240}
                  height={350}
                  alt="doctor2"
                  className="object-cover z-20 lg:block md:block hidden"
                />
              </div>
            </motion.div>

            <motion.div
              className="lg:block md:block hidden"
              variants={imageItem}
            >
              <Image
                src={assets.images.doctor3}
                width={240}
                height={240}
                alt="doctor3"
                className="absolute top-[220px] left-[150px] z-20"
              />
            </motion.div>

            <motion.div
              variants={imageItem}
              style={{ position: "absolute", bottom: -10, right: 80 }}
              className="lg:block md:block hidden"
            >
              <Image
                src={assets.images.stethoscope}
                width={180}
                height={180}
                alt="stethoscope"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
