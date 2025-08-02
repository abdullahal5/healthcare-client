"use client";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import HCTextArea from "@/components/Forms/HCTextArea";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { Button } from "@/components/ui/button";
import { useCreateReviewMutation } from "@/redux/api/reviewApi";
import { itemVariants } from "@/Transition";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { FileText, Hash } from "lucide-react";
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
  const [review, { isLoading }] = useCreateReviewMutation();

  const defaultValues = {
    appointmentId,
    rating: 0,
    comment: "",
  };

  const handleFormSubmit = async (values: FieldValues) => {
     try {
       const res = await review(values).unwrap();
       console.log(res);
       if (res.id) {
         toast.success("Review created successfully!");
         setOpen(false);
       }
     } catch (error: any) {
       const errorMessage = error?.data?.message || "Something went wrong!";
       toast.error(errorMessage);
       setOpen(false);
     }
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
              key={defaultValues.appointmentId}
              defaultValues={defaultValues}
              onSubmit={handleFormSubmit}
            >
              <motion.div className="space-y-4 w-full">
                {/* Appointment ID */}
                <motion.div className="w-full" variants={itemVariants}>
                  <HCInput
                    label="Appointment ID"
                    name="appointmentId"
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
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setRating(value);
                          }}
                          size={28}
                          className="flex-1"
                          disabled={isLoading}
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
                    icon={FileText}
                  />
                </motion.div>
              </motion.div>

              <motion.div className="flex gap-4 pt-6" variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border border-blue-500 bg-transparent"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    type="submit"
                    disabled={isLoading || rating === 0}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </HCForm>
          </motion.div>
        )}
      </AnimatePresence>
    </HCModal>
  );
};

export default ReviewModal;