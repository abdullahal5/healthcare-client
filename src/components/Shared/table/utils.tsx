import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const renderSortableHeader = <T,>(
    column: Column<T, unknown>,
    title: string
  ) => {
    const isSorted = column.getIsSorted();

    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting()}
        className="group px-2 py-1 flex items-center space-x-1 hover:bg-gray-50"
      >
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center space-x-0.5">
          {isSorted ? (
            <span className="bg-primary/10 text-primary text-xs font-medium mr-2 px-2 py-0.5 rounded">
              {isSorted === "asc" ? "A-Z" : "Z-A"}
            </span>
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-40 group-hover:opacity-80" />
          )}
        </div>
      </Button>
    );
  };