"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { toast } from "sonner";

interface SpecialistDeleteConfirmationModalProps<T> {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  mutation: any;
  entityName?: string; 
}

const DeleteSchedulesModal = <T,>({
  id,
  open,
  setOpen,
  mutation,
  entityName = "item",
}: SpecialistDeleteConfirmationModalProps<T>) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await mutation(id).unwrap();
      if (res.id) {
        toast.success("Schedules deleted successfully!");
        setOpen(false);
      }
      setOpen(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <HCModal
      open={open}
      setOpen={setOpen}
      title={`Confirm ${entityName} Deletion`}
      description={`Are you sure you want to delete this ${entityName}? This action cannot be undone.`}
      footerContent={
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <div className="text-sm text-foreground">
        This will permanently remove the {entityName} and all associated data.
      </div>
    </HCModal>
  );
};

export default DeleteSchedulesModal;
