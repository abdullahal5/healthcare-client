"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Bell,
  CalendarIcon,
  Activity,
  ClockIcon,
  User2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { PrescriptionList } from "./_components/PrescriptionList";
import { generatePDF } from "./_components/generatePDF";
import { formatDate, formatTime } from "./_components/formatDateTime";
import { useGetMyPrescriptionsQuery } from "@/redux/api/prescriptionApi";

const Prescription = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: myPrescription,
    isLoading: myPrescriptionLoading,
    isFetching: myPrescriptionFetching,
  } = useGetMyPrescriptionsQuery({});

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filterPrescriptions = () => {
    const now = new Date();
    let prescriptions = myPrescription?.prescriptions || [];

    // Filter by tab
    switch (activeTab) {
      case "upcoming":
        prescriptions = prescriptions.filter(
          (p) => p.followUpDate && new Date(p.followUpDate) > now
        );
        break;
      case "recent":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        prescriptions = prescriptions.filter(
          (p) => new Date(p.createdAt) > sevenDaysAgo
        );
        break;
    }

    return prescriptions;
  };

  const getUniqueDoctos = () => {
    const doctors = myPrescription?.prescriptions?.map((p) => p.doctor) || [];
    const uniqueDoctors = doctors.filter(
      (doctor, index, self) =>
        index === self.findIndex((d) => d.id === doctor.id)
    );
    return uniqueDoctors;
  };

  const getStats = () => {
    const prescriptions = myPrescription?.prescriptions || [];
    const now = new Date();
    const upcoming = prescriptions.filter(
      (p) => p.followUpDate && new Date(p.followUpDate) > now
    ).length;
    const recent = prescriptions.filter((p) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(p.createdAt) > sevenDaysAgo;
    }).length;

    return {
      total: prescriptions.length,
      upcoming,
      recent,
      doctors: getUniqueDoctos().length,
    };
  };

  const filteredPrescriptions = filterPrescriptions();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <PageHeader
          title="My Prescriptions"
          subtitle="View your all prescriptions and appointment details"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Prescriptions
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {getStats().total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Upcoming Follow-ups
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {getStats().upcoming}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <ClockIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Recent (7 days)
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {getStats().recent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <User2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">
                  Doctors Consulted
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {getStats().doctors}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-white border border-neutral-300 shadow-sm rounded-lg p-1 h-14">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md flex items-center gap-2 h-12"
          >
            <FileText className="h-4 w-4" />
            All Prescriptions
            <Badge
              variant="secondary"
              className="ml-1 bg-gray-100 text-gray-700"
            >
              {getStats().total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md flex items-center gap-2 h-12"
          >
            <Bell className="h-4 w-4" />
            Upcoming Follow-ups
            <Badge
              variant="secondary"
              className="ml-1 bg-gray-100 text-gray-700"
            >
              {getStats().upcoming}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md flex items-center gap-2 h-12"
          >
            <Activity className="h-4 w-4" />
            Recently Added
            <Badge
              variant="secondary"
              className="ml-1 bg-gray-100 text-gray-700"
            >
              {getStats().recent}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {myPrescriptionLoading || myPrescriptionFetching ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading prescriptions...</span>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-6">
              {filteredPrescriptions?.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No prescriptions found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </Card>
              ) : (
                <PrescriptionList
                  prescriptions={filteredPrescriptions}
                  expandedItems={expandedItems}
                  toggleExpanded={toggleExpanded}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  generatePDF={generatePDF}
                />
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              {filteredPrescriptions?.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming follow-ups
                  </h3>
                  <p className="text-gray-500">
                    All your follow-up appointments are up to date
                  </p>
                </Card>
              ) : (
                <PrescriptionList
                  prescriptions={filteredPrescriptions}
                  expandedItems={expandedItems}
                  toggleExpanded={toggleExpanded}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  generatePDF={generatePDF}
                />
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              {filteredPrescriptions?.length === 0 ? (
                <Card className="p-12 text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recent prescriptions
                  </h3>
                  <p className="text-gray-500">
                    No prescriptions added in the last 7 days
                  </p>
                </Card>
              ) : (
                <PrescriptionList
                  prescriptions={filteredPrescriptions}
                  expandedItems={expandedItems}
                  toggleExpanded={toggleExpanded}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  generatePDF={generatePDF}
                />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Prescription;
