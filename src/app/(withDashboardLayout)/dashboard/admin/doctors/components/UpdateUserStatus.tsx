import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserStatus } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

const statusOptions = [
  {
    value: "ACTIVE",
    label: "Active",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "BLOCKED",
    label: "Blocked",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "DELETED",
    label: "Deleted",
    color: "bg-red-100 text-red-800",
  },
];

export function UserStatusUpdate({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: UserStatus;
  onStatusChange: (newStatus: UserStatus) => void;
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
              onClick={() => onStatusChange(option.value as UserStatus)}
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
