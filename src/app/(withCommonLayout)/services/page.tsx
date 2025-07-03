"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Bone,
  Baby,
  Clock,
  Shield,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react";
import Image from "next/image";
import hospitalImage from "@/assets/10130.jpg"

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

const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description:
      "Comprehensive heart care with advanced diagnostic and treatment options.",
    features: ["ECG & Echo", "Cardiac Surgery", "Preventive Care"],
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Brain,
    title: "Neurology",
    description:
      "Expert neurological care for brain and nervous system disorders.",
    features: ["Brain Imaging", "Stroke Care", "Memory Clinic"],
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description:
      "Advanced bone, joint, and muscle care with minimally invasive procedures.",
    features: ["Joint Replacement", "Sports Medicine", "Spine Care"],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description:
      "Complete eye care services from routine exams to complex surgeries.",
    features: ["Cataract Surgery", "Retina Care", "LASIK"],
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description:
      "Specialized healthcare for infants, children, and adolescents.",
    features: ["Well-child Visits", "Immunizations", "Growth Monitoring"],
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: Stethoscope,
    title: "Internal Medicine",
    description: "Primary care and management of complex medical conditions.",
    features: ["Preventive Care", "Chronic Disease", "Health Screenings"],
    color: "bg-indigo-50 text-indigo-600",
  },
];

const features = [
  {
    icon: Clock,
    title: "24/7 Emergency Care",
    description:
      "Round-the-clock emergency services with rapid response times.",
  },
  {
    icon: Shield,
    title: "Advanced Technology",
    description:
      "State-of-the-art medical equipment and cutting-edge treatments.",
  },
  {
    icon: Users,
    title: "Expert Medical Team",
    description:
      "Board-certified physicians and experienced healthcare professionals.",
  },
  {
    icon: Award,
    title: "Quality Accreditation",
    description:
      "Nationally recognized for excellence in patient care and safety.",
  },
];

const process = [
  {
    step: "01",
    title: "Book Appointment",
    description:
      "Schedule your visit online or call our dedicated booking line.",
  },
  {
    step: "02",
    title: "Initial Consultation",
    description:
      "Meet with our specialists for comprehensive evaluation and diagnosis.",
  },
  {
    step: "03",
    title: "Treatment Plan",
    description:
      "Receive personalized treatment plan tailored to your specific needs.",
  },
  {
    step: "04",
    title: "Follow-up Care",
    description:
      "Ongoing monitoring and support throughout your recovery journey.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    content:
      "The cardiology team saved my life. Their expertise and compassionate care made all the difference during my treatment.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Patient",
    content:
      "Outstanding orthopedic care. I'm back to playing tennis just 3 months after my knee surgery. Highly recommend!",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Patient",
    content:
      "The pediatric team is amazing with children. My daughter actually looks forward to her check-ups now!",
    rating: 5,
  },
];

export default function HealthcareServices() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Activity className="w-4 h-4" />
              Trusted Healthcare Since 1985
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Comprehensive Healthcare
              <span className="text-blue-600 block">
                Services You Can Trust
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience world-class medical care with our team of expert
              physicians, advanced technology, and patient-centered approach to
              healing.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency: (555) 123-4567
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <Badge variant="secondary" className="mb-4">
              Our Specialties
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Medical Services & Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services delivered by board-certified
              specialists using the latest medical technology and evidence-based
              treatments.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-blue-50 group-hover:text-blue-600"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Excellence in Healthcare
                <span className="text-blue-600 block">That You Deserve</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With over 35 years of experience, we&apos;ve built a reputation for
                delivering exceptional healthcare services that prioritize
                patient safety, comfort, and outcomes.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={hospitalImage}
                  alt="Healthcare professionals"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>

              {/* Floating Stats */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-gray-600">Patients Treated</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <Badge variant="secondary" className="mb-4">
              Our Process
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Journey to Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve streamlined our process to ensure you receive the best care
              from your first appointment to complete recovery.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-blue-100">
                    <span className="text-2xl font-bold text-blue-600">
                      {step.step}
                    </span>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-blue-200 -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
