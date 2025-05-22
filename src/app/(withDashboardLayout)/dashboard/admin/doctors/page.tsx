"use client";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { DataTable } from "@/components/Shared/table/DataTable";
import { useGetAllDoctorsQuery } from "@/redux/api/doctorApi";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Doctor, IDoctor } from "@/types/doctor";
import { renderSortableHeader } from "@/components/Shared/table/utils";

const Doctors = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [sorting, setSorting] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({ sortBy: "averageRating", sortOrder: "desc" });

  const {
    data: doctorData,
    isLoading,
    isFetching,
  } = useGetAllDoctorsQuery({
    searchTerm,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const totalPages = doctorData?.meta?.total
    ? Math.ceil(doctorData.meta.total / pagination.limit)
    : 0;

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSortingChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSorting({ sortBy, sortOrder });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const columns: ColumnDef<Doctor>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "profilePhoto",
      header: "Photo",
      cell: ({ row }) => (
        <Image
          src={row.getValue("profilePhoto") || "/placeholder.svg"}
          alt={row.getValue("name")}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => renderSortableHeader(column, "Doctor Name"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "designation",
      header: "Position",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("designation")}</div>
      ),
    },
    {
      accessorKey: "currentWorkingPlace",
      header: "Hospital/Clinic",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("currentWorkingPlace")}</div>
      ),
    },
    {
      accessorKey: "averageRating",
      header: ({ column }) => renderSortableHeader(column, "Rating"),
      cell: ({ row }) => row.original?.averageRating?.toFixed(1),
    },
    {
      accessorKey: "appointmentFee",
      header: ({ column }) => renderSortableHeader(column, "Fee"),
      cell: ({ row }) => (
        <div className="text-sm font-semibold">
          ${row.getValue("appointmentFee")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const doctor = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(doctor.id)}
              >
                Copy doctor ID
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 hover:bg-red-100 focus:bg-red-100">
                Delete doctor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        subtitle="Manage and organize the doctors within your healthcare system"
        buttonLabel="Add Doctors"
        icon={<Plus className="h-4 w-4" />}
        onButtonClick={() => setIsModalOpen(true)}
      />

      {isLoading ||
      isFetching ||
      (doctorData && doctorData?.doctors?.length > 0) ||
      searchTerm ? (
        <div className="rounded-lg bg-white shadow-sm">
          <DataTable
            data={doctorData?.doctors ?? []}
            columns={columns as ColumnDef<IDoctor>[]}
            onSearchInputChange={(value) => setSearchTerm(value)}
            isLoading={isLoading}
            isFetching={isFetching}
            initialSorting={{
              sortBy: sorting.sortBy,
              sortOrder: sorting.sortOrder,
            }}
            showPagination={true}
            pageCount={totalPages}
            onPageChange={handlePaginationChange}
            currentPage={pagination.page}
            onSortingChange={handleSortingChange}
          />
        </div>
      ) : (
        <EmptyState
          icon={<Plus className="h-6 w-6 text-blue-600" />}
          title="No doctor found"
          description="Get started by creating your first medical specialty. Specialties help categorize and organize your healthcare providers and services."
          buttonLabel="Create Doctor"
          onButtonClick={() => setIsModalOpen(true)}
        />
      )}
    </div>
  );
};

export default Doctors;
