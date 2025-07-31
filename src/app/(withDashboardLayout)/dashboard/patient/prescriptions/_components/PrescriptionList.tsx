'use client'

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Clock,
  User,
  FileText,
  Phone,
  MapPin,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const PrescriptionList = ({
  prescriptions,
  expandedItems,
  toggleExpanded,
  formatDate,
  formatTime,
  generatePDF,
}: any) => {
  return (
    <>
      {prescriptions.map((prescription: any) => {
        const isExpanded = expandedItems.has(prescription.id);

        return (
          <Card
            key={prescription.id}
            className="overflow-hidden border border-neutral-300 shadow-sm hover:shadow-md transition-shadow duration-200 mb-5"
          >
            <CardContent className="p-0">
              {/* Collapsed Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleExpanded(prescription.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-blue-100">
                      <AvatarImage
                        src={prescription.doctor.profilePhoto || undefined}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {prescription.doctor.name.split(" ")[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">
                          {formatDate(prescription.appointment.createdAt)}
                        </span>
                        <Clock className="h-4 w-4 text-gray-500 ml-2" />
                        <span className="text-gray-600">
                          {formatTime(prescription.appointment.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900 font-medium">
                          {prescription.doctor.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          {prescription.appointment.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700"
                        >
                          {prescription.appointment.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="ml-4">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`prescription-${prescription.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="p-6 space-y-6">
                        {/* Prescription Details */}
                        <div className="bg-white rounded-lg p-5 border border-gray-100">
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Prescription Details
                            </h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                Instructions:
                              </label>
                              <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400">
                                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                  {prescription.instructions}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                onClick={() => generatePDF(prescription)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                  Prescribed Date:
                                </label>
                                <p className="text-gray-900">
                                  {formatDate(prescription.createdAt)} at{" "}
                                  {formatTime(prescription.createdAt)}
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                  Follow-up Date:
                                </label>
                                <p className="text-gray-900">
                                  {prescription.followUpDate
                                    ? `${formatDate(
                                        prescription.followUpDate
                                      )} at ${formatTime(
                                        prescription.followUpDate
                                      )}`
                                    : "Not scheduled"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Doctor Information */}
                        <div className="bg-white rounded-lg p-5 border border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Doctor Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                  Qualification:
                                </label>
                                <p className="text-gray-900">
                                  {prescription.doctor.qualification}
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                  Designation:
                                </label>
                                <p className="text-gray-900">
                                  {prescription.doctor.designation}
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                  Experience:
                                </label>
                                <p className="text-gray-900">
                                  {prescription.doctor.experience} years
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-900">
                                  {prescription.doctor.contactNumber}
                                </span>
                              </div>

                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                <span className="text-gray-900">
                                  {prescription.doctor.address}
                                </span>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                  Working Place:
                                </label>
                                <p className="text-gray-900">
                                  {prescription.doctor.currentWorkingPlace}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};