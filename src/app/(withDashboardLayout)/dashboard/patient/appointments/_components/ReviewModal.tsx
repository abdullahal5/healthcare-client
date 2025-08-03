"use client";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCTextArea from "@/components/Forms/HCTextArea";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Button } from "@/components/ui/button";
import {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
} from "@/redux/api/reviewApi";
import { itemVariants } from "@/Transition";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { FileText, Hash, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, FieldValues } from "react-hook-form";
import { StarRating } from "./StarRating";
import { toast } from "sonner";

const ReviewModal = ({
  open,
  setOpen,
  appointmentId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  appointmentId: string | null;
}) => {
  const [rating, setRating] = useState(0);
  const {
    data: reviews,
    isLoading,
    isFetching,
  } = useGetAllReviewsQuery(
    { appointmentId },
    {
      skip: !appointmentId,
    }
  );

  const appointmentReviews = reviews?.reviews?.filter(
    (r) => r?.appointmentId === appointmentId
  );

  if (isLoading || isFetching) {
    return (
      <HCModal width="md" open={open} setOpen={setOpen} title={"Reviews"}>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </HCModal>
    );
  }

  return (
    <HCModal width="md" open={open} setOpen={setOpen} title={"Reviews"}>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {appointmentReviews?.length ? (
              // Display all reviews
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {appointmentReviews.length} Review(s)
                  </h2>
                  <p className="text-gray-600">
                    All reviews for this appointment
                  </p>
                </div>

                <div className="space-y-6">
                  {appointmentReviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Review #{index + 1}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mb-3">
                        <StarRating
                          value={review.rating}
                          size={20}
                          className="flex-1"
                          disabled
                        />
                      </div>

                      {review.comment && (
                        <div className="text-sm text-gray-700">
                          {review.comment}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex pt-6">
                  <Button
                    variant="outline"
                    className="w-full border border-blue-500 bg-transparent"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              // No reviews yet - show create form
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Still No Review
                  </h2>
                  <p className="text-gray-600">
                    Wait for review for this appointment
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </HCModal>
  );
};

export default ReviewModal;
