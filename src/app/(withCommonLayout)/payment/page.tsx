import { Suspense } from "react";
import PaymentStatusDisplay from "./_components/PaymentStatusDisplay";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentStatusDisplay />
    </Suspense>
  );
}
