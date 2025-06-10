"use client";

import { useState } from "react";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  useDeleteScheduleMutation,
  useGetAllSchedulesQuery,
} from "@/redux/api/scheduleApi";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import { DataTable } from "@/components/Shared/table/DataTable";
import { Schedule } from "@/types";
import CreateScheduleModal from "./components/CreateScheduleModal";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { renderSortableHeader } from "@/components/Shared/table/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DeleteSchedulesModal from "./components/DeleteSchedulesModal";

const Schedules = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [pagination, setPagination] = useState({
    page: 2,
    limit: 10,
  });
  const [sorting, setSorting] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({ sortBy: "createdAt", sortOrder: "desc" });

  const [deleteSchedule] = useDeleteScheduleMutation();

  const {
    data: scheduleData,
    isLoading,
    isFetching,
  } = useGetAllSchedulesQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const totalPages = scheduleData?.meta?.total
    ? Math.ceil(scheduleData.meta.total / pagination.limit)
    : 0;

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSortingChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSorting({ sortBy, sortOrder });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = (id: string) => {
    setIsDeleteModalOpen(true);
    setSelectedId(id);
  };

  const columns: ColumnDef<Schedule>[] = [
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
      accessorKey: "startDateTime",
      header: ({ column }) => renderSortableHeader(column, "Start Time Date"),
      cell: ({ row }) => new Date(row.original?.startDateTime).toLocaleString(),
    },
    {
      accessorKey: "endDateTime",
      header: ({ column }) => renderSortableHeader(column, "End Time Date"),
      cell: ({ row }) => new Date(row.original?.endDateTime).toLocaleString(),
    },
    {
      id: "actions",
      accessorKey: "Actions",
      cell: ({ row }) => {
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
                onClick={() => handleDelete(row.original.id)}
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

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Schedules"
          subtitle="Manage and organize the schedules within your healthcare system"
          buttonLabel="Add Schedules"
          icon={<Plus className="h-4 w-4" />}
          onButtonClick={() => setIsModalOpen(true)}
        />

        {isLoading ||
        isFetching ||
        (scheduleData?.schedules?.length ?? 0) > 0 ? (
          <div className="rounded-lg bg-white shadow-sm">
            <DataTable
              data={scheduleData?.schedules ?? []}
              columns={columns}
              isLoading={isLoading}
              isFilterInputShow={false}
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

      <CreateScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />
      <DeleteSchedulesModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        id={selectedId}
        mutation={deleteSchedule}
        entityName={"Schedule"}
      />
    </>
  );
};

export default Schedules;
