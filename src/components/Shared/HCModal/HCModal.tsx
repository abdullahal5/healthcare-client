"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type ModalWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full"
  | string;

interface HCModalProps {
  title?: string;
  description?: string;
  triggerText?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "destructive";
  footerContent?: ReactNode;
  children: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  width?: ModalWidth;
  className?: string;
}

// Width mapping
const widthClasses: Record<ModalWidth, string> = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[600px]",
  lg: "sm:max-w-[800px]",
  xl: "sm:max-w-[1000px]",
  full: "sm:max-w-[95vw]",
};

export function HCModal({
  title = "Modal Title",
  description,
  triggerText = "Open Modal",
  triggerVariant = "outline",
  footerContent,
  children,
  open,
  setOpen,
  width = "sm",
  className = "",
}: HCModalProps) {
  const widthClass =
    typeof width === "string" && width in widthClasses
      ? widthClasses[width as keyof typeof widthClasses]
      : `sm:max-w-[${width}]`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={description ? "modal-description" : undefined}
        className={`${widthClass} ${className} h-[80vh] max-h-[80vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        {footerContent && <DialogFooter>{footerContent}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
