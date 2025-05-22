"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  defaultSorting?: SortingState;
  defaultColumnFilters?: ColumnFiltersState;
  defaultColumnVisibility?: VisibilityState;
  showColumnVisibilityDropdown?: boolean;
  showRowSelection?: boolean;
  filterPlaceholder?: string;
  showPagination?: boolean;
  onSearchInputChange?: (value: string) => void;
  isFilterInputShow?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSortingChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  initialSorting?: { sortBy: string; sortOrder: "asc" | "desc" };
}

export function DataTable<TData>({
  data,
  columns,
  defaultSorting = [],
  defaultColumnFilters = [],
  defaultColumnVisibility = {},
  showColumnVisibilityDropdown = true,
  showRowSelection = true,
  showPagination = true,
  filterPlaceholder = "Filter...",
  onSearchInputChange,
  isFilterInputShow = true,
  isLoading = false,
  isFetching = false,
  pageCount = 0,
  currentPage = 1,
  onPageChange,
  onSortingChange,
  initialSorting = { sortBy: "", sortOrder: "asc" },
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (initialSorting.sortBy) {
      return [
        {
          id: initialSorting.sortBy,
          desc: initialSorting.sortOrder === "desc",
        },
      ];
    }
    return defaultSorting;
  });
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchInput, setSearchInput] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    manualSorting: !!onSortingChange,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      if (onSortingChange) {
        if (newSorting.length > 0) {
          const { id, desc } = newSorting[0];
          onSortingChange(id, desc ? "desc" : "asc");
        } else {
          onSortingChange("", "asc");
        }
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: showRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (onSearchInputChange) {
        onSearchInputChange(searchInput);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchInput, onSearchInputChange]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {isFilterInputShow && (
          <Input
            placeholder={filterPlaceholder}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm"
          />
        )}
        {showColumnVisibilityDropdown && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {isLoading || isFetching ? (
              <TableRow>
                {columns.map((col, idx) => (
                  <TableHead key={idx}>
                    <Skeleton className="h-4 bg-gray-200" />
                  </TableHead>
                ))}
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))
            )}
          </TableHeader>

          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col, idx) => (
                    <TableCell key={idx}>
                      <Skeleton className="h-4 bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          {showRowSelection && (
            <div className="flex-1 text-sm text-muted-foreground">
              {table?.getFilteredSelectedRowModel().rows.length} of{" "}
              {table?.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
