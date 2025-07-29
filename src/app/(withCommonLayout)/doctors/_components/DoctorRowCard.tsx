"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { cardVariants } from "@/Transition/topRatedDoctor.transition";
import type { Doctor } from "@/types";

interface DoctorRowCardProps {
  doctor: Doctor;
}

const DoctorRowCard = ({ doctor }: DoctorRowCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col sm:flex-row"
    >
      <div className="relative h-48 sm:h-auto sm:w-64 flex-shrink-0">
        <Image
          src={doctor.profilePhoto || "/placeholder-doctor-bg.png"}
          alt={`Dr. ${doctor.name}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
          <div className="mb-4 lg:mb-0">
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              Dr. {doctor.name}
            </h3>
            <p className="text-sm text-slate-600 mb-2">
              {doctor.qualification}
            </p>
            <p className="text-sm font-medium text-blue-600">
              {doctor.designation}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{doctor.averageRating}</span>
            <span className="text-sm text-slate-500">
              ({doctor.experience} years exp.)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex text-sm items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.currentWorkingPlace}</span>
          </div>
          <div className="flex text-sm items-center text-slate-600">
            <Clock className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
            <span>450 Consultations</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto">
          <div className="mb-3 sm:mb-0">
            <span className="text-2xl font-bold text-blue-600">
              ${doctor.appointmentFee}
            </span>
            <span className="text-sm text-slate-500 ml-1">
              per consultation
            </span>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:text-blue-600 font-medium flex-1 sm:flex-none bg-transparent"
            >
              View Profile
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex-1 sm:flex-none">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorRowCard;
