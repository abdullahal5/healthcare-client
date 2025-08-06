import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaymentStatusDisplay from "./_components/PaymentStatusDisplay";

type PaymentStatusPageProps = {
  searchParams: Promise<{
    status?: string;
    transaction_id?: string;
  }>;
};

export default async function PaymentStatusPage({
  searchParams,
}: PaymentStatusPageProps) {
  try {
    const params = await searchParams;
    const status = params.status || "unknown";
    const transactionId = params.transaction_id;

    const validStatuses = ["success", "cancel", "failed", "pending", "unknown"];
    if (!validStatuses.includes(status)) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        <Suspense fallback={<PaymentLoadingFallback />}>
          <PaymentStatusDisplay
            status={status}
            transactionId={transactionId || "1234"}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error in PaymentStatusPage:", error);
    notFound();
  }
}

function PaymentLoadingFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading payment status...
        </p>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
