import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

const statusOptions = [
  {
    value: "SCHEDULED",
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "INPROGRESS",
    label: "In Progress",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELED", label: "Canceled", color: "bg-red-100 text-red-800" },
];

export function AppointmentStatusUpdate({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: AppointmentStatus;
  onStatusChange: (newStatus: AppointmentStatus) => void;
}) {
  const currentOption =
    statusOptions.find((opt) => opt.value === currentStatus) ||
    statusOptions[0];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 pl-3 pr-2 h-8",
              currentOption.color,
              "hover:bg-opacity-80"
            )}
          >
            <span>{currentOption.label}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 p-1 bg-white">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onStatusChange(option.value as AppointmentStatus)}
              className="flex items-center gap-2 p-2"
            >
              <div className={cn("w-2 h-2 rounded-full", option.color)} />
              <span className="flex-1">{option.label}</span>
              {currentStatus === option.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
