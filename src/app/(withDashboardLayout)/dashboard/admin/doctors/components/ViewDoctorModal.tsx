"use client";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Home,
  BookOpen,
  Briefcase,
  Award,
  DollarSign,
  Calendar,
  Star,
  BadgeCheck,
} from "lucide-react";
import ModalLoadingContent from "@/components/Shared/DashboardUtils/ModalLoadingContent";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetDoctorQuery } from "@/redux/api/doctorApi";
import { Key } from "react";
import {
  containerDoctorViewVariants,
  itemDoctorViewariants,
} from "@/Transition";

const ViewDoctorModal = ({
  open,
  setOpen,
  doctorId,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  doctorId: string;
}) => {
  const {
    data: singleDoctorInfo,
    isLoading,
    isFetching,
  } = useGetDoctorQuery(doctorId, {
    skip: !doctorId,
  });

  const doctor = singleDoctorInfo;

  return (
    <HCModal width="lg" open={open} setOpen={setOpen} title="Doctor Details">
      {isFetching || isLoading ? (
        <ModalLoadingContent />
      ) : (
        <motion.div
          variants={containerDoctorViewVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Section */}
          <motion.div
            variants={itemDoctorViewariants}
            className="flex items-start gap-4"
          >
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage className="object-cover" src={doctor?.profilePhoto} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10">
                {doctor?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{doctor?.name}</h2>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600"
                >
                  <BadgeCheck className="h-4 w-4 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground">{doctor?.designation}</p>

              <div className="flex items-center mt-2 gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">
                    {doctor?.averageRating}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">${doctor?.appointmentFee}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Personal Information */}
          <motion.div variants={itemDoctorViewariants}>
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {doctor?.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {doctor?.contactNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="capitalize">{doctor?.gender?.toLowerCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {doctor?.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional Information */}
          <motion.div variants={itemDoctorViewariants}>
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Professional Information
                </h3>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Registration Number
                  </p>
                  <p className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {doctor?.registrationNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {doctor?.experience} years
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Qualification</p>
                  <p className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {doctor?.qualification}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Current Workplace
                  </p>
                  <p className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {doctor?.currentWorkingPlace}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specialties */}
          {doctor?.doctorSpecialties?.length > 0 && (
            <motion.div variants={itemDoctorViewariants}>
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Specialties</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {doctor.doctorSpecialties.map(
                      (specialty: {
                        id: Key;
                        specialty: {
                          name: string;
                        };
                      }) => (
                        <Badge key={specialty.id} variant="secondary">
                          {specialty.specialty.name}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </HCModal>
  );
};

export default ViewDoctorModal;
