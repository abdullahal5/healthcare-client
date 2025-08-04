"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  FileText,
  Star,
  Pill,
  TrendingUp,
  Activity,
  Heart,
  Download,
  FileSpreadsheet,
  TrendingDown,
  Minus,
  Loader2,
  Clock,
  CheckCircle,
  RefreshCw,
  XCircle,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@/types";
import { useDashboardDataQuery } from "@/redux/api/dashboardApi";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const COLORS = {
  [AppointmentStatus.SCHEDULED]: "#3b82f6",
  [AppointmentStatus.INPROGRESS]: "#f59e0b",
  [AppointmentStatus.COMPLETED]: "#10b981",
  [AppointmentStatus.CANCELED]: "#ef4444",
};

const STATUS_ICONS = {
  [AppointmentStatus.SCHEDULED]: Clock,
  [AppointmentStatus.INPROGRESS]: RefreshCw,
  [AppointmentStatus.COMPLETED]: CheckCircle,
  [AppointmentStatus.CANCELED]: XCircle,
};

const PatientDashboard = () => {
  const {
    data: dashboardData,
    isLoading,
    isFetching,
  } = useDashboardDataQuery({});

  console.log(dashboardData);

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Transform the appointment status distribution data
  const statusData = dashboardData?.appointmentStatusDistribution?.map(
    (item: any) => ({
      name: item.status,
      value: item.count,
      percentage: Math.round(
        (item.count / dashboardData?.appointmentCount) * 100
      ),
    })
  );

  // Generate mock monthly health data for the line chart
  const healthData = [
    { month: "Jan", appointments: Math.floor(Math.random() * 5) + 1 },
    { month: "Feb", appointments: Math.floor(Math.random() * 5) + 1 },
    { month: "Mar", appointments: Math.floor(Math.random() * 5) + 2 },
    { month: "Apr", appointments: Math.floor(Math.random() * 5) + 1 },
    { month: "May", appointments: Math.floor(Math.random() * 5) + 2 },
    { month: "Jun", appointments: Math.floor(Math.random() * 5) + 1 },
  ];

  const stats = [
    {
      title: "My Appointments",
      value: dashboardData?.appointmentCount,
      icon: Calendar,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-50 via-blue-25 to-white",
      darkBgGradient:
        "dark:from-blue-950/30 dark:via-blue-900/20 dark:to-gray-900",
      iconBg: "bg-blue-500",
      borderColor: "border-blue-200 dark:border-blue-800/50",
      change: "+2",
      changeType: "positive",
      glowColor: "shadow-blue-500/20",
      description: "Total scheduled visits",
    },
    {
      title: "Active Prescriptions",
      value: dashboardData?.prescriptionCount,
      icon: Pill,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      bgGradient: "bg-gradient-to-br from-purple-50 via-purple-25 to-white",
      darkBgGradient:
        "dark:from-purple-950/30 dark:via-purple-900/20 dark:to-gray-900",
      iconBg: "bg-purple-500",
      borderColor: "border-purple-200 dark:border-purple-800/50",
      change: "+1",
      changeType: "positive",
      glowColor: "shadow-purple-500/20",
      description: "Current medications",
    },
    {
      title: "My Reviews",
      value: dashboardData?.reviewCount,
      icon: Star,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      bgGradient: "bg-gradient-to-br from-yellow-50 via-yellow-25 to-white",
      darkBgGradient:
        "dark:from-yellow-950/30 dark:via-yellow-900/20 dark:to-gray-900",
      iconBg: "bg-yellow-500",
      borderColor: "border-yellow-200 dark:border-yellow-800/50",
      change: "0",
      changeType: "neutral",
      glowColor: "shadow-yellow-500/20",
      description: "Doctor feedback given",
    },
    {
      title: "Health Score",
      value: "85%",
      icon: Heart,
      color: "bg-gradient-to-r from-red-500 to-pink-600",
      bgGradient: "bg-gradient-to-br from-red-50 via-pink-25 to-white",
      darkBgGradient:
        "dark:from-red-950/30 dark:via-pink-900/20 dark:to-gray-900",
      iconBg: "bg-red-500",
      borderColor: "border-red-200 dark:border-red-800/50",
      change: "+5%",
      changeType: "positive",
      glowColor: "shadow-red-500/20",
      description: "Overall wellness indicator",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const exportToCSV = () => {
    const data = [
      ["Metric", "Value", "Change"],
      ...stats.map((stat) => [stat.title, stat.value, stat.change]),
    ];
    const csvContent = data.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(
      blob,
      `patient-dashboard-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Data exported to CSV");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      stats.map((stat) => ({
        Metric: stat.title,
        Value: stat.value,
        Change: stat.change,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard Data");
    XLSX.writeFile(
      wb,
      `patient-dashboard-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    toast.success("Data exported to Excel");
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3 mr-1" />;
      case "negative":
        return <TrendingDown className="h-3 w-3 mr-1" />;
      default:
        return <Minus className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Heart className="h-10 w-10 text-red-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                My Health Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Your personal health overview and appointment management
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="gap-2 bg-transparent"
            >
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={exportToExcel}
              className="gap-2 bg-transparent"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card
                className={cn(
                  "relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02]",
                  stat.bgGradient,
                  stat.darkBgGradient,
                  stat.borderColor,
                  `hover:${stat.glowColor}`
                )}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, currentColor 1px, transparent 1px),
                                   radial-gradient(circle at 80% 20%, currentColor 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                {/* Animated Background Orb */}
                <motion.div
                  className={cn(
                    "absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-10",
                    stat.iconBg
                  )}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {stat.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <motion.div
                    className={cn(
                      "p-3 rounded-xl shadow-lg transition-all duration-300",
                      stat.color,
                      "group-hover:shadow-xl group-hover:scale-110"
                    )}
                    whileHover={{ rotate: 12 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </motion.div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium border transition-all duration-300 group-hover:scale-105",
                        getChangeColor(stat.changeType)
                      )}
                    >
                      {getChangeIcon(stat.changeType)}
                      {stat.change}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", stat.color)}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          stat.changeType === "positive"
                            ? "75%"
                            : stat.changeType === "negative"
                            ? "25%"
                            : "50%",
                      }}
                      transition={{
                        delay: index * 0.1 + 0.5,
                        duration: 1,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg",
                    stat.color
                  )}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Health Trends Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      Health Trends
                    </CardTitle>
                    <CardDescription>
                      Your appointment frequency over the past months
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const csvContent = [
                        ["Month", "Appointments"],
                        ...healthData.map((item: any) => [
                          item.month,
                          item.appointments,
                        ]),
                      ]
                        .map((e) => e.join(","))
                        .join("\n");
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      saveAs(
                        blob,
                        `health-trends-${
                          new Date().toISOString().split("T")[0]
                        }.csv`
                      );
                      toast.success("Chart data exported");
                    }}
                    className="text-muted-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    appointments: {
                      label: "Appointments",
                      color: "#377DF4",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={healthData}
                      margin={{ top: 20, right: 70, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="month"
                        className="text-sm"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        className="text-sm"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="var(--color-appointments)"
                        strokeWidth={3}
                        dot={{
                          fill: "var(--color-appointments)",
                          strokeWidth: 2,
                          r: 6,
                        }}
                        activeDot={{
                          r: 8,
                          stroke: "var(--color-appointments)",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appointment Status Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Appointment Status
                    </CardTitle>
                    <CardDescription>
                      Current status of your appointments
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const csvContent = [
                        ["Status", "Count", "Percentage"],
                        ...statusData?.map((item: any) => [
                          item.name,
                          item.value,
                          `${item.percentage}%`,
                        ]),
                      ]
                        .map((e) => e.join(","))
                        .join("\n");
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      saveAs(
                        blob,
                        `appointments-status-${
                          new Date().toISOString().split("T")[0]
                        }.csv`
                      );
                      toast.success("Chart data exported");
                    }}
                    className="text-muted-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    SCHEDULED: {
                      label: "Scheduled",
                      color: COLORS.SCHEDULED,
                    },
                    COMPLETED: {
                      label: "Completed",
                      color: COLORS.COMPLETED,
                    },
                    INPROGRESS: {
                      label: "In Progress",
                      color: COLORS.INPROGRESS,
                    },
                    CANCELED: {
                      label: "Canceled",
                      color: COLORS.CANCELED,
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData?.map(
                          (entry: { name: AppointmentStatus }, index: any) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[entry.name as keyof typeof COLORS]}
                            />
                          )
                        )}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {data.value} appointments ({data.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {statusData?.map((item: any) => {
                    const IconComponent =
                      STATUS_ICONS[item.name as keyof typeof STATUS_ICONS];
                    return (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[item.name as keyof typeof COLORS],
                          }}
                        />
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium flex items-center gap-1">
                          {item.name.toLowerCase().replace("_", " ")} (
                          {item.value})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Manage your health and appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                >
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Book Appointment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                >
                  <Pill className="h-6 w-6" />
                  <span className="text-sm">Prescriptions</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Medical Records</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                >
                  <Star className="h-6 w-6" />
                  <span className="text-sm">Rate Doctor</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Health Tips
              </CardTitle>
              <CardDescription>
                Personalized recommendations for better health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">
                      Regular Checkups
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Schedule your next appointment to maintain good health
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">
                      Medication Reminder
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Don&apos;t forget to take your prescribed medications
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Stay Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Regular exercise helps maintain overall wellness
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
