"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { navLinks, socialLinks } from "@/constant/Footer.constant";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const socialVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.3 + i * 0.1,
      },
    }),
  };

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.5,
      },
    },
  };

  return (
    <footer className="bg-[#0f172a] text-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Navigation Links */}
          <motion.nav
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8"
            variants={itemVariants}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </motion.nav>

          {/* Social Media Icons */}
          <motion.div
            className="flex justify-center space-x-3 mb-8"
            variants={itemVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-colors duration-300 flex items-center justify-center"
                custom={index}
                variants={socialVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.name}
              >
                <Image
                  src={social.icon}
                  width={40}
                  height={40}
                  alt="social link"
                />
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="w-full max-w-3xl mx-auto mb-8"
            variants={itemVariants}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Separator className="bg-gray-700" />
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-3xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="mb-4 md:mb-0 text-sm text-gray-400"
            >
              ©2023 PH Health Care. All Rights Reserved.
            </motion.div>

            <motion.div
              variants={logoVariants}
              className="mb-4 md:mb-0 order-first md:order-none"
            >
              <Link href="/" className="text-2xl font-bold">
                <span className="text-[#1586FD]">PH</span> Health Care
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex space-x-4 text-sm text-gray-400"
            >
              <Link
                href="/privacy"
                className="hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <span>|</span>
              <Link
                href="/terms"
                className="hover:text-white transition-colors duration-300"
              >
                Terms & Conditions
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
