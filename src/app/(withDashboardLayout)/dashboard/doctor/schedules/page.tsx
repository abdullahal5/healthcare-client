"use client";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { DataTable } from "@/components/Shared/table/DataTable";
import { DoctorSchedules } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
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
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { renderSortableHeader } from "@/components/Shared/table/utils";
import { useGetMyScheduleQuery } from "@/redux/api/doctorScheduleApi";
import { useRouter, useSearchParams } from "next/navigation";
import CreateScheduleModal from "./components/CreateScheduleModal";

const Schedules = () => {
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] =
    useState<boolean>(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("view");
    params.delete("edit");
    router.push(`?${params.toString()}`);
  };

  const {
    data: schedulesData,
    isLoading,
    isFetching,
  } = useGetMyScheduleQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const columns: ColumnDef<DoctorSchedules>[] = [
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
      accessorKey: "schedule.startDateTime",
      header: "Start Time",
      cell: ({ row }) => {
        const startDate = row?.original?.schedule?.startDateTime;
        const formatted =
          startDate && !isNaN(new Date(startDate).getTime())
            ? format(new Date(startDate), "PPpp")
            : "Invalid date";
        return <div className="text-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "schedule.endDateTime",
      header: "End Time",
      cell: ({ row }) => {
        const endDate = row?.original?.schedule?.endDateTime;
        const formatted =
          endDate && !isNaN(new Date(endDate).getTime())
            ? format(new Date(endDate), "PPpp")
            : "Invalid date";
        return <div className="text-sm">{formatted}</div>;
      },
    },

    {
      accessorKey: "isBooked",
      header: "Booked",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-md ${
            row?.original?.isBooked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {row?.original?.isBooked ? "Yes" : "No"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const schedule = row.original;

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
              <DropdownMenuItem onClick={() => console.log("ok")}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Delete", schedule)}
                className="text-red-600 hover:bg-red-100 focus:bg-red-100"
              >
                Delete Schedule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const totalPages = schedulesData?.meta?.total
    ? Math.ceil(schedulesData.meta.total / pagination.limit)
    : 0;


  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Schedules"
          subtitle="Manage and organize the schedules within your healthcare system"
          buttonLabel="Add Schedules"
          icon={<Plus className="h-4 w-4" />}
          onButtonClick={() => setIsCreateScheduleModalOpen(true)}
        />

        {isLoading ||
        isFetching ||
        (schedulesData && schedulesData?.data?.length > 0) ? (
          <div className="rounded-lg bg-white shadow-sm">
            <DataTable
              data={schedulesData?.data ?? []}
              columns={columns as ColumnDef<DoctorSchedules>[]}
              isLoading={isLoading}
              isFetching={isFetching}
              isFilterInputShow={false}
              showPagination={true}
              pageCount={totalPages}
              onPageChange={handlePaginationChange}
              currentPage={pagination.page}
            />
          </div>
        ) : (
          <EmptyState
            icon={<Plus className="h-6 w-6 text-blue-600" />}
            title="No schedules found"
            description="Get started by creating your first medical specialty. Specialties help categorize and organize your healthcare providers and services."
            buttonLabel="Create Schedules"
            onButtonClick={() => setIsCreateScheduleModalOpen(true)}
          />
        )}
      </div>

      <CreateScheduleModal
        open={isCreateScheduleModalOpen}
        setOpen={setIsCreateScheduleModalOpen}
      />
    </>
  );
};

export default Schedules;
