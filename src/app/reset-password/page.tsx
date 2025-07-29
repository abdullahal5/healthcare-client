import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
