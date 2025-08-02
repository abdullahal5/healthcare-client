import { Button } from "@/components/ui/button";
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
  Share2,
  Award,
  Stethoscope,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorScheduleSlot from "../_components/DoctorScheduleSlot";
import { Doctor } from "@/types";
import DoctorReviews from "../_components/DoctorReviews";

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Doctor Profile Header */}
        <div>
          <Card className="overflow-hidden shadow-lg">
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
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          {/* Doctor Details Sidebar */}
          <div className="lg:col-span-1 space-y-6">
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
                    <GraduationCap className="h-5 w-5 mt-0.5 text-blue-400" />
                    <div>
                      <p className="font-medium">Qualification</p>
                      <p className="text-sm text-gray-600">
                        {doctorData.qualification}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-blue-400" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600">
                        {doctorData.address}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 mt-0.5 text-blue-400" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-gray-600">
                        {doctorData.contactNumber}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">
                      REG
                    </Badge>
                    <div>
                      <p className="font-medium">Registration Number</p>
                      <p className="text-sm text-gray-600">
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
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    Pediatrics
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    Child Nutrition
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    Vaccination
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    Growth Monitoring
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
            <Tabs defaultValue="appointment" className="w-full">
              <TabsList className="flex w-full lg:flex-row md:flex-row flex-col  md:gap-5 gap-2 bg-blue-50">
                <TabsTrigger
                  value="appointment"
                  className="py-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white border border-neutral-300 flex items-center justify-center flex-1"
                >
                  <Calendar className="h-5 w-5 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">Book Appointment</span>
                </TabsTrigger>

                <TabsTrigger
                  value="reviews"
                  className="py-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white border border-neutral-300 flex items-center justify-center flex-1"
                >
                  <Star className="h-5 w-5 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">
                    Reviews ({doctorData?.review?.length})
                  </span>
                </TabsTrigger>

                {/* <TabsTrigger
                  value="about"
                  className="py-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white border border-neutral-300 flex items-center justify-center"
                >
                  <GraduationCap className="h-5 w-5 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="appointment">
                <DoctorScheduleSlot id={doctorData.id as string} />
              </TabsContent>

              <TabsContent value="reviews">
                <DoctorReviews
                  reviews={doctorData.review}
                  averageRating={doctorData.averageRating}
                />
              </TabsContent>

              {/* <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About Doctor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Detailed about doctor content will go here</p>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
