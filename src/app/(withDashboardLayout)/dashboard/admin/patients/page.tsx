"use client";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { DataTable } from "@/components/Shared/table/DataTable";
import { useGetAllPatientsQuery } from "@/redux/api/patientApi";
import { Patient, UserStatus } from "@/types";
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
import Image from "next/image";
import { renderSortableHeader } from "@/components/Shared/table/utils";
import { useChangeStatusMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserStatusUpdate } from "../doctors/components/UpdateUserStatus";
import { useModalQuery } from "@/hooks/useModalQuery";
import ViewPatientModal from "./_components/ViewPatientModal";

const PatientPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [sorting, setSorting] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({ sortBy: "createdAt", sortOrder: "desc" });

  const {
    data: allPatients,
    isLoading,
    isFetching,
  } = useGetAllPatientsQuery({
    searchTerm,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const {
    id: viewId,
    isOpen: isViewModalOpen,
    openModal: openViewModal,
    closeModal: closeViewModal,
  } = useModalQuery("view");

  const totalPages = allPatients?.meta?.total
    ? Math.ceil(allPatients.meta.total / pagination.limit)
    : 0;

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSortingChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSorting({ sortBy, sortOrder });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const [changeStatus] = useChangeStatusMutation();

  const columns: ColumnDef<Patient>[] = [
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
      header: ({ column }) => renderSortableHeader(column, "Patient Name"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("contactNumber")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "user.status",
      header: "Status",
      cell: ({ row }) => {
        const patient = row.original;
        const handleStatusChange = async (newStatus: UserStatus) => {
          try {
            const res = await changeStatus({
              status: newStatus,
              id: patient.user.id,
            }).unwrap();
            if (res.id) {
              toast.success(`Status updated to ${newStatus}`);
            }
          } catch {
            toast.error("Failed to update status");
          }
        };

        return (
          <UserStatusUpdate
            currentStatus={patient?.user?.status as UserStatus}
            onStatusChange={handleStatusChange}
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original;

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
              <DropdownMenuItem onClick={() => openViewModal(patient.id)}>
                View details
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => openEditModal(patient.id)}>
                Edit
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem
                onClick={() => handleDeleteClick(patient.id)}
                className="text-red-600 hover:bg-red-100 focus:bg-red-100"
              >
                Delete patient
              </DropdownMenuItem> */}
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
          title="Patients"
          subtitle="Manage and organize the Patients within your healthcare system"
        />

        {isLoading ||
        isFetching ||
        (allPatients && allPatients?.patients?.length > 0) ||
        searchTerm ? (
          <div className="rounded-lg bg-white shadow-sm">
            <DataTable
              data={allPatients?.patients ?? []}
              columns={columns as ColumnDef<Patient>[]}
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
            title="No Patient found"
            description="Get started by creating your first medical specialty. Specialties help categorize and organize your healthcare providers and services."
          />
        )}
      </div>

      {isViewModalOpen && (
        <ViewPatientModal
          open={true}
          setOpen={closeViewModal}
          patientId={viewId as string}
        />
      )}
    </>
  );
};

export default PatientPage;
