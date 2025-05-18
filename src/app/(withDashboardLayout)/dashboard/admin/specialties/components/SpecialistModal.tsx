import { HCModal } from "@/components/Shared/HCModal/HCModal";
import { ReactNode } from "react";

const SpecialistModal = ({
  open,
  setOpen,
  children
}: {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
  children: ReactNode
}) => {
  return (
    <HCModal open={open} setOpen={setOpen} title="Create Specialist">
      {children}
    </HCModal>
  );
};

export default SpecialistModal;
