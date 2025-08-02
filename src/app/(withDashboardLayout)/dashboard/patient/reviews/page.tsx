"use client";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { DataTable } from "@/components/Shared/table/DataTable";
import { useGetAllReviewsQuery } from "@/redux/api/reviewApi";
import { Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { StarRating } from "../appointments/_components/StarRating";
import { Button } from "@/components/ui/button";
import { renderSortableHeader } from "@/components/Shared/table/utils";
import { format } from "date-fns";
import { Eye, Pen } from "lucide-react";
import { getUserInfo } from "@/services/auth.services";
import { useModalQuery } from "@/hooks/useModalQuery";
import ViewReviewModal from "./_components/ViewReviewModal";

const ReviewPage = () => {
  const info = getUserInfo();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [sorting, setSorting] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({ sortBy: "createdAt", sortOrder: "desc" });
  const {
    data: reviewData,
    isLoading,
    isFetching,
  } = useGetAllReviewsQuery({
    patientEmail: info?.email,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const totalPages = reviewData?.meta?.total
    ? Math.ceil(reviewData.meta.total / pagination.limit)
    : 0;

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSortingChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSorting({ sortBy, sortOrder });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const {
    id: reviewId,
    isOpen: isViewModalOpen,
    openModal: openViewModal,
    closeModal: closeViewModal,
  } = useModalQuery("view");

  const columns: ColumnDef<Review>[] = [
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
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const doctor = row.original.doctor;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 rounded-full object-cover">
              <AvatarImage
                src={doctor?.profilePhoto || "/placeholder-doctor.jpg"}
                className="rounded-full object-cover w-full h-full"
                alt={doctor?.name}
              />
              <AvatarFallback>{doctor?.name?.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{doctor?.name}</div>
              <div className="text-sm text-gray-500">{doctor?.designation}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center gap-2">
            <StarRating value={rating} size={16} disabled />
            {/* <span className="font-medium">{rating.toFixed(1)}</span> */}
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Review",
      cell: ({ row }) => {
        const comment = row.getValue("comment") as string;
        return (
          <div className="max-w-[300px] truncate" title={comment}>
            {comment}
          </div>
        );
      },
    },
    {
      accessorKey: "appointment",
      header: "Appointment Status",
      cell: ({ row }) => {
        const status = row.original.appointment?.status;
        return (
          <div className="capitalize">
            {status === "COMPLETED" ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                {status?.toLowerCase()}
              </span>
            )}
          </div>
        );
      },
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => openViewModal(review?.id)}
                variant="outline"
                size="sm"
                className="border-neutral-300"
              >
                <Eye />
                view
              </Button>
            </div>
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-300"
                onClick={() => console.log("View details", review.id)}
              >
                <Pen />
                Update
              </Button>
            </div> */}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="My Reviews"
          subtitle="Manage and organize the reviews within your healthcare system"
        />

        {isLoading ||
        isFetching ||
        (reviewData && reviewData?.reviews?.length > 0) ? (
          <div className="rounded-lg bg-white shadow-sm">
            <DataTable
              data={reviewData?.reviews ?? []}
              columns={columns}
              isLoading={isLoading}
              isFetching={isFetching}
              isFilterInputShow={false}
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
            title="No Reviews found"
            description="Get started by creating your first Review. Specialties help categorize and organize your healthcare providers and services."
          />
        )}
      </div>

      {isViewModalOpen && (
        <ViewReviewModal
          open={true}
          setOpen={closeViewModal}
          reviewId={reviewId as string}
        />
      )}
    </>
  );
};

export default ReviewPage;
