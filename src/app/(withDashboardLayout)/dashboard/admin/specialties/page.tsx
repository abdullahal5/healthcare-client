"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpecialistModal from "./components/SpecialistModal";
import { useState } from "react";

const Specialties = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean | undefined>();
  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Specialties
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create, edit, and organize medical specialties for your healthcare
              system.
            </p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Specialty
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="max-w-md space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                No specialties yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Get started by creating your first medical specialty.
                Specialties help categorize and organize your healthcare
                providers and services.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Specialty
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <SpecialistModal open={isModalOpen} setOpen={setIsModalOpen}></SpecialistModal>
    </>
  );
};

export default Specialties;
