"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";
import {
  buttonVariants,
  cardVariants,
  containerVariants,
  titleVariants,
} from "@/Transition/topRatedDoctor.transition";
import { Doctor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

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
          <Card
            key={doctor.id}
            className="group bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                width={400}
                height={200}
                src={
                  doctor.profilePhoto ||
                  "/placeholder.svg?height=200&width=400&text=Doctor"
                }
                alt={`Dr. ${doctor.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <CardContent className="p-5 flex flex-col flex-grow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Dr. {doctor.name}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  {doctor.qualification}
                </p>
              </div>

              <div className="space-y-2 mb-4 flex-grow">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 mr-2">📍</span>
                  <span>{doctor.currentWorkingPlace}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 mr-2">💰</span>
                  <span>${doctor.appointmentFee || "N/A"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 mr-2">⭐</span>
                  <span>4.8 (450 reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <Link className="w-full" href={`/doctors/${doctor.id}#booking`}>
                  <Button className="bg-gradient-to-r w-full from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium">
                    Book Now
                  </Button>
                </Link>
                <Link className="w-full" href={`/doctors/${doctor.id}`}>
                  <Button
                    variant="outline"
                    className="border-blue-500 w-full text-blue-500 hover:bg-blue-50 font-medium bg-transparent"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
