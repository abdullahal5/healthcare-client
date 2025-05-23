"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { toast } from "sonner";

interface DoctorDeleteConfirmationModalProps<T> {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  softDeleteMutation: any;
  hardDeleteMutation: any;
  entityName?: string;
}

const DeleteDoctorModal = <T,>({
  id,
  open,
  setOpen,
  softDeleteMutation,
  hardDeleteMutation,
  entityName = "item",
}: DoctorDeleteConfirmationModalProps<T>) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteType, setDeleteType] = useState<"soft" | "hard" | null>(null);

  const handleDelete = async (type: "soft" | "hard") => {
    try {
      setIsDeleting(true);
      setDeleteType(type);

      const mutation =
        type === "soft" ? softDeleteMutation : hardDeleteMutation;
      const res = await mutation(id).unwrap();

      if (res.id) {
        toast.success(
          `Doctor ${
            type === "soft" ? "archived" : "permanently deleted"
          } successfully!`
        );
        setOpen(false);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteType(null);
    }
  };

  return (
    <HCModal
      open={open}
      setOpen={setOpen}
      title={`Confirm ${entityName} Deletion`}
      description={`Choose how you want to delete this ${entityName}.`}
      footerContent={
        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => handleDelete("soft")}
              disabled={isDeleting}
            >
              {isDeleting && deleteType === "soft" ? "Archiving..." : "Archive"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete("hard")}
              disabled={isDeleting}
            >
              {isDeleting && deleteType === "hard"
                ? "Deleting..."
                : "Delete Permanently"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="text-sm text-foreground space-y-2">
        <p>This will remove the {entityName} from active records.</p>

        <div className="mt-4 space-y-2">
          <p className="font-medium">Archive (Soft Delete):</p>
          <ul className="list-disc pl-5">
            <li>Marks the {entityName} as inactive</li>
            <li>Can be restored later</li>
            <li>Keeps all associated data</li>
          </ul>
        </div>

        <div className="mt-4 space-y-2">
          <p className="font-medium">Delete Permanently (Hard Delete):</p>
          <ul className="list-disc pl-5">
            <li>Completely removes the {entityName}</li>
            <li>Cannot be undone</li>
            <li>May delete associated data</li>
          </ul>
        </div>
      </div>
    </HCModal>
  );
};

export default DeleteDoctorModal;
