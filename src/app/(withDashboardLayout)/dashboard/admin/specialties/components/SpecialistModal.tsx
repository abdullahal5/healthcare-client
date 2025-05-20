"use client";
import { motion, AnimatePresence } from "framer-motion";
import HCForm from "@/components/Forms/HCForm";
import HCInput from "@/components/Forms/HCInput";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { FieldValues } from "react-hook-form";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import HCFileUploader from "@/components/Forms/HCFileUploader";
import { containerVariants, itemVariants } from "@/Transition/SpecialistModal";
import { useRef, useState } from "react";
import { modifyPayload } from "@/utils/modifyPayload";
import { useCreateSpecialtyMutation } from "@/redux/api/specialtiesApi";
import { toast } from "sonner";
import { specialistSchema } from "@/schema/specialty.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const SpecialistModal = ({
  open,
  setOpen,
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}) => {
  const fileUploaderRef = useRef<{ reset: () => void }>();
  const [createSpecialty] = useCreateSpecialtyMutation();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: FieldValues) => {
    setLoading(true);
    try {
      const data = modifyPayload(values);
      const res = await createSpecialty(data).unwrap();
      if(res.id){
        toast.success("Specialist created successfully!");
        setOpen(false);
      }
      fileUploaderRef.current?.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HCModal open={open} setOpen={setOpen} title="Create Specialist">
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-h-[70vh] overflow-y-auto overflow-x-hidden p-3"
          >
            <HCForm
              // resolver={zodResolver(specialistSchema)}
              onSubmit={handleFormSubmit}
            >
              <motion.div
                className="space-y-3"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                <motion.div variants={itemVariants}>
                  <HCInput
                    label="Title"
                    placeholder="Ex. Cardiology"
                    name="title"
                    type="text"
                    size="lg"
                    icon={FileText}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HCFileUploader name="file" ref={fileUploaderRef} />
                </motion.div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                className="pt-4"
              >
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </motion.div>
            </HCForm>
          </motion.div>
        )}
      </AnimatePresence>
    </HCModal>
  );
};

export default SpecialistModal;
