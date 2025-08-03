"use client";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CopyUrl = () => {
  const handleCopyUrl = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => toast.success("Copied"))
      .catch(() => {
        toast.error("Failed to copy URL");
      });
  };
  return (
    <div className="flex gap-3">
      <Button
        variant="ghost"
        onClick={handleCopyUrl}
        size="icon"
        className="rounded-full bg-white/10 hover:bg-white/20 text-white"
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CopyUrl;
