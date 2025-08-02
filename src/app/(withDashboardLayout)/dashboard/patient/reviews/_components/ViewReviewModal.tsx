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
import { FileText, Hash } from "lucide-react";
import { Controller } from "react-hook-form";
import { StarRating } from "../../appointments/_components/StarRating";

const ViewReviewModal = ({
  open,
  setOpen,
  reviewId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  reviewId: string | null;
}) => {
  const { data: reviewData, isLoading } = useGetAllReviewsQuery({});

  const singleReview = reviewData?.reviews?.find(
    (review) => review.id === reviewId
  );

  const defaultValues = {
    reviewId,
    rating: singleReview?.rating,
    comment: singleReview?.comment,
  };

  return (
    <HCModal width="md" open={open} setOpen={setOpen} title={"Create Review"}>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Write a Review
              </h2>
              <p className="text-gray-600">
                Share your experience with this appointment
              </p>
            </div>

            <HCForm
              key={defaultValues.reviewId}
              defaultValues={defaultValues}
              onSubmit={() => {}}
            >
              <motion.div className="space-y-4 w-full">
                {/* Appointment ID */}
                <motion.div className="w-full" variants={itemVariants}>
                  <HCInput
                    label="Appointment ID"
                    name="reviewId"
                    className="w-full"
                    type="text"
                    disabled
                    size="lg"
                    icon={Hash}
                  />
                </motion.div>

                {/* Star Rating */}
                <motion.div className="w-full" variants={itemVariants}>
                  <Controller
                    name="rating"
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Rating
                        </label>
                        <StarRating
                          value={field?.value}
                          onChange={(value) => {
                            field?.onChange(value);
                          }}
                          size={28}
                          className="flex-1"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Click on stars to rate. You can give fractional
                          ratings too!
                        </p>
                      </div>
                    )}
                  />
                </motion.div>

                {/* Review Text */}
                <motion.div className="w-full" variants={itemVariants}>
                  <HCTextArea
                    label="Review Text"
                    name="comment"
                    className="w-full"
                    placeholder="Write your review"
                    rows={5}
                    size="lg"
                    disabled
                    icon={FileText}
                  />
                </motion.div>
              </motion.div>
            </HCForm>
          </motion.div>
        )}
      </AnimatePresence>
    </HCModal>
  );
};

export default ViewReviewModal;
