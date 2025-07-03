"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Stethoscope,
  Users,
  Clock,
  Shield,
  Building2,
  Target,
  Eye,
  Activity,
  UserCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <Badge
                variant="secondary"
                className="text-blue-600 bg-blue-100 text-lg px-4 py-2"
              >
                <Heart className="w-5 h-5 mr-2" />
                Caring for Our Community Since 1985
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                HealthCare Plus
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Your trusted healthcare partner, providing comprehensive medical
                services with compassion, innovation, and excellence for over
                three decades.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 bg-transparent"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Locations
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Clock, number: "38+", label: "Years of Service" },
              { icon: Users, number: "50,000+", label: "Patients Served" },
              {
                icon: UserCheck,
                number: "150+",
                label: "Medical Professionals",
              },
              { icon: Building2, number: "12", label: "Locations" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Foundation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on principles of excellence, compassion, and innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To provide exceptional healthcare services that improve the health and well-being of our community through compassionate care, advanced medical technology, and a commitment to excellence.",
                color: "blue",
              },
              {
                icon: Eye,
                title: "Our Vision",
                description:
                  "To be the leading healthcare provider in our region, recognized for our innovative treatments, exceptional patient care, and positive impact on community health outcomes.",
                color: "green",
              },
              {
                icon: Heart,
                title: "Our Values",
                description:
                  "Compassion, Integrity, Excellence, Innovation, Respect, and Collaboration guide everything we do as we serve our patients and community with dedication.",
                color: "purple",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0 text-center space-y-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                        item.color === "blue"
                          ? "bg-blue-100"
                          : item.color === "green"
                          ? "bg-green-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <item.icon
                        className={`w-8 h-8 ${
                          item.color === "blue"
                            ? "text-blue-600"
                            : item.color === "green"
                            ? "text-green-600"
                            : "text-purple-600"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Healthcare facility"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in 1985 by Dr. Michael Thompson and Dr. Sarah Chen,
                    HealthCare Plus began as a small family practice with a
                    simple mission: to provide personalized, compassionate
                    healthcare to our local community.
                  </p>
                  <p>
                    Over the past 38 years, we&apos;ve grown from a single clinic to
                    a comprehensive healthcare network with 12 locations,
                    serving over 50,000 patients across the region. Our growth
                    has been driven by our unwavering commitment to excellence
                    and our patients&apos; trust.
                  </p>
                  <p>
                    Today, we&apos;re proud to offer a full spectrum of medical
                    services, from primary care and specialized treatments to
                    emergency services and preventive care, all while
                    maintaining the personal touch that has defined us from the
                    beginning.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1985</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Locations</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From routine check-ups to specialized treatments, we&apos;re here for
              every stage of your health journey
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Stethoscope,
                title: "Primary Care",
                description:
                  "Comprehensive family medicine and preventive care",
              },
              {
                icon: Heart,
                title: "Cardiology",
                description: "Advanced heart and cardiovascular treatments",
              },
              {
                icon: Activity,
                title: "Emergency Care",
                description: "24/7 emergency medical services",
              },
              {
                icon: Users,
                title: "Pediatrics",
                description:
                  "Specialized care for infants, children, and adolescents",
              },
              {
                icon: Shield,
                title: "Preventive Medicine",
                description: "Health screenings and wellness programs",
              },
              {
                icon: Zap,
                title: "Urgent Care",
                description: "Walk-in care for non-emergency medical needs",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card className="h-full p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0 space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                      <service.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to providing exceptional
              healthcare
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                name: "Dr. Michael Thompson",
                role: "Chief Medical Officer",
                specialty: "Internal Medicine",
              },
              {
                name: "Dr. Sarah Chen",
                role: "Medical Director",
                specialty: "Family Medicine",
              },
              {
                name: "Dr. James Rodriguez",
                role: "Head of Cardiology",
                specialty: "Cardiovascular Surgery",
              },
              {
                name: "Dr. Emily Johnson",
                role: "Pediatrics Director",
                specialty: "Pediatric Medicine",
              },
            ].map((doctor, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt={doctor.name}
                    width={300}
                    height={300}
                    className="rounded-2xl shadow-lg mx-auto group-hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-1">{doctor.role}</p>
                <p className="text-gray-600 text-sm">{doctor.specialty}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Recognized for excellence in healthcare delivery and patient
              satisfaction
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              "Best Healthcare Provider 2023",
              "Patient Safety Excellence Award",
              "Top Employer in Healthcare",
              "Community Service Recognition",
            ].map((award, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{award}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp} className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied patients who trust HealthCare Plus for
              their medical needs. Schedule your appointment today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>12 Locations Across the Region</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
