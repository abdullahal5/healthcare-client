"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { buttonVariants, cardVariants, containerVariants, titleVariants } from "@/Transition/topRatedDoctor.transition";
import { Doctor } from "@/types";

const DoctorCard = ({ doctors }: { doctors: Doctor[] }) => {
  return (
    <div className="w-full">
      <motion.div
        className="mb-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={titleVariants}
      >
        <h1 className="text-4xl font-semibold text-blue-900 mb-3">
          Access to expert physicians and surgeons
        </h1>
        <p className="text-lg max-w-3xl mx-auto">
          Advanced technologies and top-quality surgery facilities right here.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {doctors?.map((doctor) => (
          <motion.div
            key={doctor.id}
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
          >
            <div className="relative h-56 w-full flex-shrink-0">
              <Image
                src={doctor.profilePhoto || "/placeholder-doctor-bg.png"}
                alt={`Dr. ${doctor.name}`}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-800">
                  Dr. {doctor.name}
                </h3>
                <p className="text-xs mt-1">{doctor.qualification}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex text-sm items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{doctor.currentWorkingPlace}</span>
                </div>
                <div className="flex text-sm items-center text-slate-600">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  <span>450 Consultations</span>
                </div>
              </div>

              {/* Buttons container pushed to bottom */}
              <div className="mt-auto grid grid-cols-2 gap-3">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
                  size="lg"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:text-blue-600 font-medium"
                  size="lg"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="text-center pt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href="/doctors"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium"
          >
            View All Doctors
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorCard;
