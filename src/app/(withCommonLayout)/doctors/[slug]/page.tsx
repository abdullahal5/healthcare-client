import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Phone,
  Star,
  GraduationCap,
  Briefcase,
  DollarSign,
  Award,
  Stethoscope,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorScheduleSlot from "../_components/DoctorScheduleSlot";
import { Doctor } from "@/types";
import DoctorReviews from "../_components/DoctorReviews";
import CopyUrl from "../_components/utils/CopyUrl";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctor/${slug}`
  );
  const { data: doctor } = await res.json();
  const doctorData = doctor as Doctor;
  const specialist = doctorData?.doctorSpecialties?.map(
    (spec) => spec?.specialities?.title
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gradient-to-br from-blue-50/50 to-indigo-100/50">
      {/* Doctor Profile Header - Full Width */}
      <div className="w-full">
        <Card className="overflow-hidden shadow-lg rounded-none md:rounded-lg md:mx-4 md:mt-4">
          <div className="relative">
            {/* Doctor header background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90" />
            <div className="relative z-10 p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                {/* Doctor Avatar with Floating Badge */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white/20 shadow-xl">
                    <AvatarImage
                      src={doctorData.profilePhoto || "/placeholder.svg"}
                      alt={doctorData.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-500 text-2xl font-bold text-white">
                      {doctorData.name.split(" ")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-md px-4 py-1.5 bg-white text-blue-600 hover:bg-white/90">
                    <Stethoscope className="h-4 w-4 mr-1" />
                    {doctorData.designation}
                  </Badge>
                </div>
                {/* Doctor Info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">
                      {doctorData.name}
                    </h1>
                    <p className="text-xl text-blue-100/90">
                      {doctorData.currentWorkingPlace}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-white">
                        {doctorData.averageRating?.toFixed(1)}
                      </span>
                      <span className="text-blue-100/80 text-sm">Rating</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Briefcase className="h-4 w-4 text-blue-100" />
                      <span className="text-white">
                        {doctorData.experience} years
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <DollarSign className="h-4 w-4 text-blue-100" />
                      <span className="font-semibold text-white">
                        ${doctorData.appointmentFee}
                      </span>
                      <span className="text-blue-100/80 text-sm">Fee</span>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <CopyUrl />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl p-4 md:p-8 pt-4">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Doctor Details Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* About Doctor Card */}
              <Card className="shadow-sm border-neutral-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Award className="h-5 w-5" />
                    <span>About Doctor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">Qualification</p>
                        <p className="text-sm text-gray-600 break-words">
                          {doctorData.qualification}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-gray-600 break-words">
                          {doctorData.address}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">Contact</p>
                        <p className="text-sm text-gray-600 break-words">
                          {doctorData.contactNumber}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Badge
                        variant="secondary"
                        className="mt-0.5 flex-shrink-0"
                      >
                        REG
                      </Badge>
                      <div className="min-w-0">
                        <p className="font-medium">Registration Number</p>
                        <p className="text-sm text-gray-600 break-words">
                          {doctorData.registrationNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specializations Card */}
              <Card className="shadow-sm border-neutral-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Stethoscope className="h-5 w-5" />
                    <span>Specializations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {specialist.length > 0
                      ? specialist?.map((title, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="px-3 py-1 text-sm border border-neutral-300"
                          >
                            {title}
                          </Badge>
                        ))
                      : "NO SPECIALIST ADDED"}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Card - Mobile Hidden, Desktop Visible */}
              <Card className="shadow-sm border-neutral-300 hidden lg:block">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-600">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Reviews</span>
                    <span className="font-semibold">
                      {doctorData?.review?.length || 0}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="font-semibold">
                      {doctorData.experience} years
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Consultation Fee
                    </span>
                    <span className="font-semibold text-green-600">
                      ${doctorData.appointmentFee}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Tabs Navigation - Improved */}
              <Card className="shadow-sm">
                <Tabs defaultValue="appointment" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 h-auto">
                    <TabsTrigger
                      value="appointment"
                      className="py-3 px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Book Appointment</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="py-3 px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Star className="h-4 w-4" />
                      <span className="font-medium">
                        Reviews ({doctorData?.review?.length || 0})
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="appointment" className="mt-0">
                    <DoctorScheduleSlot id={doctorData.id as string} />
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0">
                    <div className="p-6">
                      <DoctorReviews
                        reviews={doctorData.review}
                        averageRating={doctorData.averageRating}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
