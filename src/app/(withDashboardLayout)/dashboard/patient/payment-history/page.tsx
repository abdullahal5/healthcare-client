"use client";
import EmptyState from "@/components/Shared/DashboardUtils/EmptyState";
import PageHeader from "@/components/Shared/DashboardUtils/PageHeader";
import { DataTable } from "@/components/Shared/table/DataTable";
import { useGetMyPaymentHistoryQuery } from "@/redux/api/paymentApi";
import { Payment } from "@/types";
import { useState } from "react";
import {
  MoreHorizontal,
  BadgeCheck,
  Clock,
  XCircle,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const {
    data: paymentData,
    isLoading,
    isFetching,
  } = useGetMyPaymentHistoryQuery({
    searchTerm,
    page: Number(pagination.page),
    limit: Number(pagination.limit),
  });

  const totalPages = paymentData?.meta?.total
    ? Math.ceil(paymentData.meta.total / pagination.limit)
    : 0;

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const columns: ColumnDef<Payment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => (
        <div className="text-sm font-mono text-gray-600">
          {row.original.transactionId}
        </div>
      ),
    },
    {
      accessorKey: "paymentDate",
      header: () => {
        return <>Date & Time</>;
      },
      cell: ({ row }) => {
        let formattedDate = "Invalid date";
        let formattedTime = "Invalid time";

        try {
          const date = new Date(row?.original?.createdAt);
          if (!isNaN(date.getTime())) {
            formattedDate = format(date, "MMM dd, yyyy");
            formattedTime = format(date, "h:mm a");
          }
        } catch (error) {
          console.error("Error formatting date:", error);
        }

        return (
          <div className="flex flex-col">
            <span className="font-medium">{formattedDate}</span>
            <span className="text-sm text-gray-500">{formattedTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => {
        return <>Amount</>;
      },
      cell: ({ row }) => (
        <div className="font-semibold">${row.original?.amount.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="flex items-center">
            {status === "PAID" ? (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                  <BadgeCheck className="h-4 w-4 mr-2" /> Paid
                </span>
              </>
            ) : status === "PENDING" ? (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm">
                  <XCircle className="h-4 w-4 mr-2" /> Failed
                </span>
              </>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "Download",
      header: "Download",
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => downloadPaymentReceipt(row.original)}
            variant="outline"
            className="border-neutral-300"
          >
            <Download /> Download
          </Button>
        );
      },
    },
  ];

  const downloadPaymentReceipt = async (payment: any) => {
    // Create a temporary element to hold the receipt content
    const receiptElement = document.createElement("div");
    receiptElement.style.position = "absolute";
    receiptElement.style.left = "-9999px";
    receiptElement.style.padding = "24px";
    receiptElement.style.backgroundColor = "white";
    receiptElement.style.width = "210mm"; // A4 width
    receiptElement.style.fontFamily = "Arial, sans-serif";

    // Format dates
    const paymentDate = format(new Date(payment.createdAt), "MMMM dd, yyyy");
    const paymentTime = format(new Date(payment.createdAt), "h:mm a");
    const transactionDate = payment.paymentGatewayData?.tran_date
      ? format(
          new Date(payment.paymentGatewayData.tran_date),
          "MMMM dd, yyyy h:mm a"
        )
      : paymentDate;

    // Build the receipt HTML
    receiptElement.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin-bottom: 5px;">Payment Receipt</h1>
        <p style="color: #7f8c8d; margin-top: 0;">Transaction ID: ${
          payment.transactionId
        }</p>
      </div>
      
      <!-- Payment Summary -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-top: 0;">
          Payment Summary
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p><strong>Payment Date:</strong> ${paymentDate} at ${paymentTime}</p>
            <p><strong>Transaction Date:</strong> ${transactionDate}</p>
            <p><strong>Payment Status:</strong> 
              <span style="color: ${
                payment.status === "PAID" ? "#27ae60" : "#e74c3c"
              }; font-weight: bold;">
                ${payment.status}
              </span>
            </p>
          </div>
          <div>
            <p><strong>Amount Paid:</strong> $${payment.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> 
              ${payment.paymentGatewayData?.card_brand || "Card"} 
              (•••• ${payment.paymentGatewayData?.card_no?.slice(-4) || ""})
            </p>
            <p><strong>Card Issuer:</strong> ${
              payment.paymentGatewayData?.card_issuer || "N/A"
            }</p>
          </div>
        </div>
      </div>
      
      <!-- Appointment Details -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-top: 0;">
          Appointment Details
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p><strong>Appointment ID:</strong> ${payment.appointmentId}</p>
            <p><strong>Appointment Date:</strong> ${format(
              new Date(payment.appointment.createdAt),
              "MMMM dd, yyyy h:mm a"
            )}</p>
            <p><strong>Appointment Status:</strong> ${
              payment.appointment.status
            }</p>
          </div>
          <div>
            ${
              payment.appointment?.doctor
                ? `
              <p><strong>Doctor:</strong> ${payment.appointment.doctor.name}</p>
              <p><strong>Specialization:</strong> ${payment.appointment.doctor.designation}</p>
              <p><strong>Hospital:</strong> ${payment.appointment.doctor.currentWorkingPlace}</p>
            `
                : ""
            }
          </div>
        </div>
      </div>
      
      <!-- Payment Gateway Details -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-top: 0;">
          Payment Gateway Details
        </h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p><strong>Transaction ID:</strong> ${
              payment.paymentGatewayData?.tran_id || payment.transactionId
            }</p>
            <p><strong>Bank Transaction ID:</strong> ${
              payment.paymentGatewayData?.bank_tran_id || "N/A"
            }</p>
            <p><strong>Validation:</strong> ${
              payment.paymentGatewayData?.validated_on
                ? format(
                    new Date(payment.paymentGatewayData.validated_on),
                    "MMMM dd, yyyy h:mm a"
                  )
                : "N/A"
            }</p>
          </div>
          <div>
            <p><strong>Card Type:</strong> ${
              payment.paymentGatewayData?.card_type || "N/A"
            }</p>
            <p><strong>Risk Level:</strong> ${
              payment.paymentGatewayData?.risk_title || "N/A"
            }</p>
            <p><strong>Currency:</strong> ${
              payment.paymentGatewayData?.currency || "N/A"
            }</p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eaeaea; padding-top: 20px;">
        <p>This is an official payment receipt from PH HealthCare</p>
        <p>For any questions, please contact support@phhealthcare.com</p>
        <p style="margin-top: 15px;">Generated on ${format(
          new Date(),
          "MMMM dd, yyyy h:mm a"
        )}</p>
      </div>
    </div>
  `;

    document.body.appendChild(receiptElement);

    try {
      // Generate PDF
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(receiptElement, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PH-HealthCare-Receipt-${payment.transactionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Clean up
      document.body.removeChild(receiptElement);
    }
  };

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Manage and organize the payments within your healthcare system"
      />

      {isLoading ||
      isFetching ||
      (paymentData && paymentData?.payment?.length > 0) ||
      searchTerm ? (
        <div className="rounded-lg bg-white shadow-sm">
          <DataTable
            data={paymentData?.payment ?? []}
            columns={columns as ColumnDef<Payment>[]}
            onSearchInputChange={(value) => setSearchTerm(value)}
            isLoading={isLoading}
            isFetching={isFetching}
            showPagination={true}
            pageCount={totalPages}
            onPageChange={handlePaginationChange}
            currentPage={pagination.page}
          />
        </div>
      ) : (
        <EmptyState
          title="No Payment History found"
          description="Get started by creating your first medical specialty. Specialties help categorize and organize your healthcare providers and services."
        />
      )}
    </>
  );
};

export default PaymentHistory;