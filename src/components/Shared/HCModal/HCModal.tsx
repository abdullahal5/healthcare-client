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

interface HCModalProps {
  title?: string;
  description?: string;
  triggerText?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "destructive";
  footerContent?: ReactNode;
  children: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export function HCModal({
  title = "Modal Title",
  description,
  triggerText = "Open Modal",
  triggerVariant = "outline",
  footerContent,
  children,
  open,
  setOpen,
}: HCModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
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
