"use client";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { DataTable } from "@/components/Shared/table/DataTable";
import { MoreHorizontal, Video } from "lucide-react";
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
import { renderSortableHeader } from "@/components/Shared/table/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types";
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [sorting, setSorting] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({ sortBy: "createdAt", sortOrder: "desc" });

  const searchParams = useSearchParams();
  const router = useRouter();

  const appointmentIdFromViewParams = searchParams.get("view");
  const isViewModalOpen = !!appointmentIdFromViewParams;

  const openViewModal = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", id);
    router.push(`?${params.toString()}`);
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("view");
    router.push(`?${params.toString()}`);
  };

  const {
    data: appointmentData,
    isLoading,
    isFetching,
  } = useGetMyAppointmentsQuery({
    searchTerm,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const totalPages = appointmentData?.meta?.total
    ? Math.ceil(appointmentData.meta.total / pagination.limit)
    : 0;

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSortingChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSorting({ sortBy, sortOrder });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Scheduled
          </Badge>
        );
      case "INPROGRESS":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Canceled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const columns: ColumnDef<Appointment>[] = [
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
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => {
        const patient = row?.original?.patient;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={patient?.profilePhoto || "/placeholder-patient.jpg"}
                alt={patient?.name}
              />
              <AvatarFallback>{patient?.name?.charAt(0) || "P"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{patient?.name}</div>
              <div className="text-sm text-gray-500">
                {patient?.contactNumber}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "schedule",
      header: "Date & Time",
      cell: ({ row }) => {
        const schedule = row.original.schedule;
        return (
          <div>
            <div className="font-medium">
              {format(new Date(schedule.startDateTime), "MMM dd, yyyy")}
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(schedule.startDateTime), "h:mm a")} -{" "}
              {format(new Date(schedule.endDateTime), "h:mm a")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const paymentStatus = row.original.paymentStatus;

        return (
          <div>
            {getStatusBadge(status)}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const paymentStatus = row.getValue("paymentStatus");
        return (
          <div className="capitalize">
            {paymentStatus === "UNPAID" ? (
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm">
                Unpaid
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                Paid
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "doctor.appointmentFee",
      header: "Fee",
      cell: ({ row }) => (
        <div className="font-semibold">
          ${row.original.doctor.appointmentFee}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => renderSortableHeader(column, "Booked On"),
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy h:mm a")}
        </div>
      ),
    },
    {
      accessorKey: "Join",
      header: "Join",
      cell: ({ row }) => (
        <Link
          href={`/video?videoCallingId=${row?.original?.videoCallingId}`}
          className="text-sm"
        >
          <Video />
        </Link>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appointment = row.original;

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
              {/* <DropdownMenuItem onClick={() => openViewModal(appointment.id)}>
                View details
              </DropdownMenuItem> */}
              {appointment.paymentStatus === "UNPAID" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-green-600">
                    Make Payment
                  </DropdownMenuItem>
                </>
              )}
              {appointment.status === "SCHEDULED" && (
                <DropdownMenuItem className="text-red-600">
                  Cancel Appointment
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Appointments"
          subtitle="Manage and organize the appointments within your healthcare system"
        />

        {isLoading ||
        isFetching ||
        (appointmentData && appointmentData?.appointments?.length > 0) ||
        searchTerm ? (
          <div className="rounded-lg bg-white shadow-sm">
            <DataTable
              data={appointmentData?.appointments ?? []}
              columns={columns}
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
            title="No appointment found"
            description="Get started by creating your first medical specialty. Specialties help categorize and organize your healthcare providers and services."
          />
        )}
      </div>

      {/* view appointment modal */}
      {/* {isViewModalOpen && (
        <ViewAppointmentModal
          open={true}
          setOpen={closeModal}
          appointmentId={appointmentIdFromViewParams}
        />
      )} */}
    </>
  );
};

export default Appointments;
