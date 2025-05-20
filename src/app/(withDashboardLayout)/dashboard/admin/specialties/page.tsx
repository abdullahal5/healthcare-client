"use client";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpecialistModal from "./components/SpecialistModal";
import { useState } from "react";
import {
  useDeleteSpecialtyMutation,
  useGetAllSpecialtiesQuery,
} from "@/redux/api/specialtiesApi";
import { DataTable } from "@/components/Shared/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import SpecialistDeleteConfirmationModal from "./components/SpecialistDeleteConfirmationModa";

type TSpecialties = {
  id: string;
  title: string;
  icon: string;
};

const Specialties = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");

  const {
    data: specialtyData,
    isLoading,
    isFetching,
  } = useGetAllSpecialtiesQuery({});

  const [deleteSpecialty] = useDeleteSpecialtyMutation();

  const handleDeleteClick = (id: string) => {
    setSelectedSpecialtyId(id);
    setDeleteModalOpen(true);
  };

  const columns: ColumnDef<TSpecialties>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => (
        <Image
          src={row.getValue("icon")}
          alt={row.getValue("title")}
          width={30}
          height={30}
          className="w-8 h-8 object-contain"
        />
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      ),
      filterFn: "includesString",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      id: "actions",
      accessorKey: "Actions",
      cell: ({ row }) => {
        const specialty = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-gray-100">
                Edit specialty
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(specialty.id)}
                className="text-red-600 hover:bg-red-100 focus:bg-red-100"
              >
                Delete specialty
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Specialties</h1>
          <p className="text-muted-foreground">
            Manage medical specialties for your healthcare system
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Specialty
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <DataTable
          data={specialtyData ?? []}
          columns={columns}
          isFilterInputShow={false}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      {!specialtyData && (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center shadow-sm">
          <div className="max-w-md space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">No specialties found</h2>
            <p className="text-muted-foreground">
              Get started by creating your first medical specialty. Specialties
              help categorize and organize your healthcare providers and
              services.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Specialty
            </Button>
          </div>
        </div>
      )}

      <SpecialistModal open={isModalOpen} setOpen={setIsModalOpen} />

      <SpecialistDeleteConfirmationModal
        id={selectedSpecialtyId}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        mutation={deleteSpecialty}
        entityName="specialty"
      />
    </div>
  );
};

export default Specialties;
