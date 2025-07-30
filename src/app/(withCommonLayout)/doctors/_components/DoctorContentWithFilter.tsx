"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  X,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { titleVariants } from "@/Transition/topRatedDoctor.transition";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAllDoctorsQuery } from "@/redux/api/doctorApi";
import Pagination from "@/components/Shared/Tools/Pagination";
import Image from "next/image";
import type { Doctor } from "@/types";
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi";
import DoctorRowCard from "./DoctorRowCard";
import Link from "next/link";

type ViewMode = "grid" | "row";
type SortOrder = "asc" | "desc";
type Gender = "MALE" | "FEMALE";

const SORT_OPTIONS = [
  { value: "appointmentFee", label: "Appointment Fee" },
  { value: "experience", label: "Experience" },
  { value: "averageRating", label: "Average Rating" },
  { value: "name", label: "Name" },
];

// Light animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DoctorContentWithFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("appointmentFee");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [gender, setGender] = useState<Gender | "ANY">("ANY");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Initialize state from URL params
  useEffect(() => {
    const page = searchParams.get("page");
    const search = searchParams.get("searchTerm");
    const view = searchParams.get("view") as ViewMode;
    const specialties = searchParams.get("specialties");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder") as SortOrder;
    const genderParam = searchParams.get("gender") as Gender;

    if (page) setCurrentPage(Number.parseInt(page));
    if (search) setSearchTerm(search);
    if (view && ["grid", "row"].includes(view)) setViewMode(view);
    if (specialties) {
      setSelectedSpecialties(specialties.split(",").map((s) => s.trim()));
    }
    if (sortByParam) setSortBy(sortByParam);
    if (sortOrderParam && ["asc", "desc"].includes(sortOrderParam))
      setSortOrder(sortOrderParam);
    if (genderParam && ["MALE", "FEMALE"].includes(genderParam))
      setGender(genderParam);
  }, [searchParams]);

  // Fetch doctors data
  const { data, isLoading, isFetching, error } = useGetAllDoctorsQuery({
    page: currentPage,
    limit: 6,
    searchTerm: debouncedSearchTerm,
    specialties:
      selectedSpecialties.length > 0
        ? selectedSpecialties.join(",")
        : undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? sortOrder : undefined,
    gender: gender === "ANY" ? undefined : gender || undefined,
  });

  const { data: allSpecialties, isLoading: specialtiesLoading } =
    useGetAllSpecialtiesQuery({});

  const SPECIALTIES = allSpecialties?.map(
    (specialty: { title: string }) => specialty.title
  );

  // Update URL with all parameters
  const updateURL = (params: Record<string, string | number | undefined>) => {
    const newSearchParams = new URLSearchParams();

    // Add all current and new parameters
    const allParams = {
      searchTerm: debouncedSearchTerm || undefined,
      page: currentPage,
      view: viewMode,
      specialties:
        selectedSpecialties.length > 0
          ? selectedSpecialties.join(",")
          : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
      gender: gender || undefined,
      ...params,
    };

    Object.entries(allParams).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams.set(key, value.toString());
      }
    });

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL({ searchTerm: value || undefined, page: 1 });
  };

  const handleSpecialtyAdd = (specialty: string) => {
    if (!selectedSpecialties.includes(specialty)) {
      const newSpecialties = [...selectedSpecialties, specialty];
      setSelectedSpecialties(newSpecialties);
      setCurrentPage(1);
      updateURL({ specialties: newSpecialties.join(","), page: 1 });
    }
  };

  const handleSpecialtyRemove = (specialty: string) => {
    const newSpecialties = selectedSpecialties.filter((s) => s !== specialty);
    setSelectedSpecialties(newSpecialties);
    setCurrentPage(1);
    updateURL({
      specialties:
        newSpecialties.length > 0 ? newSpecialties.join(",") : undefined,
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    updateURL({ sortBy: value, page: 1 });
  };

  const handleSortOrderChange = (order: SortOrder) => {
    setSortOrder(order);
    setCurrentPage(1);
    updateURL({ sortOrder: order, page: 1 });
  };

  const handleGenderChange = (value: string) => {
    const newGender = value as Gender | "ANY";
    setGender(newGender);
    setCurrentPage(1);

    updateURL({
      gender: newGender === "ANY" ? undefined : newGender,
      page: 1,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSortBy("");
    setSortOrder("asc");
    setGender("ANY");
    setCurrentPage(1);
    updateURL({
      searchTerm: undefined,
      specialties: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      gender: undefined,
      page: 1,
    });
  };

  const doctors = (data?.doctors as unknown as Doctor[]) || [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;
  const hasActiveFilters =
    selectedSpecialties.length > 0 || sortBy || gender || searchTerm;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-8 text-center max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Error Loading Doctors
            </h2>
            <p className="text-gray-600">Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Find Your Perfect Doctor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse through our extensive network of qualified healthcare
            professionals
          </p>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Search Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search doctors by name, specialty, or location..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-12 border-neutral-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 border-neutral-400"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>

                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setViewMode("grid");
                      updateURL({ view: "grid" });
                    }}
                    className="flex items-center border-neutral-400"
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "row" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setViewMode("row");
                      updateURL({ view: "row" });
                    }}
                    className="flex items-center border-neutral-400"
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pt-4 mt-6 border-t border-neutral-300"
                >
                  {/* Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Specialty Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Filter className="w-4 h-4 mr-1" />
                        Specialty
                      </label>
                      <Select value="" onValueChange={handleSpecialtyAdd}>
                        <SelectTrigger className="h-10 border-neutral-300">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {specialtiesLoading
                            ? "loading"
                            : SPECIALTIES.filter(
                                (specialty: string) =>
                                  !selectedSpecialties.includes(specialty)
                              ).map((specialty: string) => (
                                <SelectItem
                                  className="text-black"
                                  key={specialty}
                                  value={specialty}
                                >
                                  {specialty}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gender Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        Gender
                      </label>
                      <Select value={gender} onValueChange={handleGenderChange}>
                        <SelectTrigger className="h-10 border-neutral-300">
                          <SelectValue placeholder="Any gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="ANY">Any gender</SelectItem>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <SlidersHorizontal className="w-4 h-4 mr-1" />
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="h-10 border-neutral-300">
                          <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="appointmentFee">
                            Default
                          </SelectItem>{" "}
                          {/* Updated default value */}
                          {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Order */}
                    {sortBy && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Order
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            variant={
                              sortOrder === "asc" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleSortOrderChange("asc")}
                            className="flex-1 border-neutral-300"
                          >
                            Low to High
                          </Button>
                          <Button
                            variant={
                              sortOrder === "desc" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleSortOrderChange("desc")}
                            className="flex-1 border-neutral-300"
                          >
                            High to Low
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Filters */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                      <span className="text-sm font-medium text-gray-700">
                        Active filters:
                      </span>

                      {selectedSpecialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {specialty}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-blue-900"
                            onClick={() => handleSpecialtyRemove(specialty)}
                          />
                        </Badge>
                      ))}

                      {gender && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
                          {gender}
                        </Badge>
                      )}

                      {sortBy && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          {
                            SORT_OPTIONS.find((opt) => opt.value === sortBy)
                              ?.label
                          }{" "}
                          ({sortOrder === "asc" ? "↑" : "↓"})
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-gray-600 hover:text-gray-800 ml-2"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Info */}
        {meta && (
          <motion.div
            className="mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              Showing {(currentPage - 1) * 6 + 1} -{" "}
              {Math.min(currentPage * 6, meta.total)} of {meta.total} doctors
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              {selectedSpecialties.length > 0 &&
                ` in ${selectedSpecialties.join(", ")}`}
              {gender && ` (${gender.toLowerCase()})`}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading ||
          (isFetching && (
            <div className="flex items-center justify-center py-12">
              <Card className="p-8">
                <CardContent className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-600">Loading doctors...</span>
                </CardContent>
              </Card>
            </div>
          ))}

        {/* Doctors Grid/List */}
        {!isLoading && !isFetching && doctors.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <motion.div key={doctor.id} variants={cardVariants}>
                    <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          width={400}
                          height={200}
                          src={
                            doctor.profilePhoto ||
                            "/placeholder.svg?height=200&width=400&text=Doctor"
                          }
                          alt={`Dr. ${doctor.name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            Dr. {doctor.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {doctor.qualification}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4 flex-grow">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-4 h-4 mr-2">📍</span>
                            <span>{doctor.currentWorkingPlace}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-4 h-4 mr-2">💰</span>
                            <span>${doctor.appointmentFee || "N/A"}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-4 h-4 mr-2">⭐</span>
                            <span>4.8 (450 reviews)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium">
                            Book Now
                          </Button>
                          <Link className="w-full" href={`/doctors/${doctor.id}`}>
                            <Button
                              variant="outline"
                              className="border-blue-500 w-full text-blue-500 hover:bg-blue-50 font-medium bg-transparent"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <motion.div key={doctor.id} variants={cardVariants}>
                    <DoctorRowCard doctor={doctor} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && doctors.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="p-8 max-w-md mx-auto bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Doctors Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters
                    ? "No doctors match your current filters"
                    : "No doctors available at the moment"}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="mt-2 bg-transparent"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pagination */}
        {meta && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                updateURL({ page });
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
