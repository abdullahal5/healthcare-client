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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Users,
  UserCheck,
  Shield,
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingDown,
  Minus,
  Loader2,
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

export default function HealthcareDashboard() {
  const {
    data: dashboardData,
    isLoading,
    isFetching,
  } = useDashboardDataQuery({});

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const monthlyData = dashboardData?.barChartData?.map((item: any) => ({
    month: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    appointments: item.count,
  }));

  const statusData = dashboardData?.pieChartData?.map((item: any) => ({
    name: item.status,
    value: item.count,
    percentage: Math.round((item.count / dashboardData.appointmentCount) * 100),
  }));

  const stats = [
    {
      title: "Total Appointments",
      value: dashboardData?.appointmentCount,
      icon: Calendar,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-50 via-blue-25 to-white",
      darkBgGradient:
        "dark:from-blue-950/30 dark:via-blue-900/20 dark:to-gray-900",
      iconBg: "bg-blue-500",
      borderColor: "border-blue-200 dark:border-blue-800/50",
      change: "+12%",
      changeType: "positive",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Active Patients",
      value: dashboardData?.patientCount,
      icon: Users,
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      bgGradient: "bg-gradient-to-br from-emerald-50 via-emerald-25 to-white",
      darkBgGradient:
        "dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-gray-900",
      iconBg: "bg-emerald-500",
      borderColor: "border-emerald-200 dark:border-emerald-800/50",
      change: "+8%",
      changeType: "positive",
      glowColor: "shadow-emerald-500/20",
    },
    {
      title: "Available Doctors",
      value: dashboardData?.doctorCount,
      icon: UserCheck,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      bgGradient: "bg-gradient-to-br from-purple-50 via-purple-25 to-white",
      darkBgGradient:
        "dark:from-purple-950/30 dark:via-purple-900/20 dark:to-gray-900",
      iconBg: "bg-purple-500",
      borderColor: "border-purple-200 dark:border-purple-800/50",
      change: "0%",
      changeType: "neutral",
      glowColor: "shadow-purple-500/20",
    },
    {
      title: "System Admins",
      value: dashboardData?.adminCount,
      icon: Shield,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      bgGradient: "bg-gradient-to-br from-orange-50 via-orange-25 to-white",
      darkBgGradient:
        "dark:from-orange-950/30 dark:via-orange-900/20 dark:to-gray-900",
      iconBg: "bg-orange-500",
      borderColor: "border-orange-200 dark:border-orange-800/50",
      change: "0%",
      changeType: "neutral",
      glowColor: "shadow-orange-500/20",
    },
    {
      title: "Total Payments",
      value: dashboardData?.paymentCount,
      icon: CreditCard,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      bgGradient: "bg-gradient-to-br from-indigo-50 via-indigo-25 to-white",
      darkBgGradient:
        "dark:from-indigo-950/30 dark:via-indigo-900/20 dark:to-gray-900",
      iconBg: "bg-indigo-500",
      borderColor: "border-indigo-200 dark:border-indigo-800/50",
      change: "+15%",
      changeType: "positive",
      glowColor: "shadow-indigo-500/20",
    },
    {
      title: "Total Revenue",
      value: `$${dashboardData?.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      bgGradient: "bg-gradient-to-br from-green-50 via-green-25 to-white",
      darkBgGradient:
        "dark:from-green-950/30 dark:via-green-900/20 dark:to-gray-900",
      iconBg: "bg-green-500",
      borderColor: "border-green-200 dark:border-green-800/50",
      change: "+22%",
      changeType: "positive",
      glowColor: "shadow-green-500/20",
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
      `healthcare-dashboard-${new Date().toISOString().split("T")[0]}.csv`
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
      `healthcare-dashboard-${new Date().toISOString().split("T")[0]}.xlsx`
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Activity className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Healthcare Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Comprehensive overview of your healthcare management system
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={exportToExcel} className="gap-2">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {stat.title}
                  </CardTitle>
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

                {/* Bottom Accent Line */}
                {/* <motion.div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 transition-all duration-500",
                    stat.color
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.7, duration: 0.8 }}
                  style={{ transformOrigin: "left" }}
                /> */}

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
          {/* Monthly Appointments Bar Chart */}
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
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Monthly Appointments
                    </CardTitle>
                    <CardDescription>
                      Appointment trends over the past months
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Export chart data
                      const csvContent = [
                        ["Month", "Appointments"],
                        ...monthlyData.map((item: any) => [
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
                        `appointments-monthly-${
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
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                      <Bar
                        dataKey="appointments"
                        fill="var(--color-appointments)"
                        radius={[4, 4, 0, 0]}
                        className="fill-blue-500 hover:fill-blue-600 transition-colors"
                      />
                    </BarChart>
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
                      <Activity className="h-5 w-5 text-green-600" />
                      Appointment Status
                    </CardTitle>
                    <CardDescription>
                      Current status distribution of appointments
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Export chart data
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
                        {statusData?.map((entry: { name: AppointmentStatus; }, index: any) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name as keyof typeof COLORS]}
                          />
                        ))}
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
                <div className="flex justify-center gap-6 mt-4">
                  {statusData?.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[item.name as keyof typeof COLORS],
                        }}
                      />
                      <span className="text-xs font-medium flex items-center gap-1">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
