"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

interface SpecialtyType {
  id: string;
  title: string;
  icon: string;
}

interface SpecialistCardProps {
  specialties: SpecialtyType[];
}

const SpecialistCard = ({ specialties }: SpecialistCardProps) => {
  const constraintsRef = useRef(null);

  return (
    <div className="container mx-auto py-16 px-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow-lg overflow-hidden">
      <motion.div
        className="mb-12 text-left"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-semibold text-blue-900 mb-2">
          Explore Treatments Across Specialties
        </h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Experienced Doctors Across All Specialties
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        ref={constraintsRef}
      >
        {specialties?.slice(0, 6)?.map((specialty) => (
          <motion.div
            key={specialty.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              borderColor: "#3b82f6",
              borderWidth: "2px",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-white p-6 rounded-xl shadow-md duration-300 border-2 border-transparent flex flex-col items-center text-center"
          >
            <Link
              href={`/doctors?specialties=${specialty.title}`}
              className="w-full h-full flex flex-col items-center"
            >
              <motion.div
                className="w-20 h-20 relative mb-4"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={specialty.icon || "/placeholder.svg"}
                  alt={`${specialty.title} icon`}
                  fill
                  className="object-contain"
                />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800">
                {specialty.title}
              </h3>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center"
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
            href="/specialties"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium"
          >
            View All Specialties
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpecialistCard;
