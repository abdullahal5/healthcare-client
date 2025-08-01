import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { Patient } from "@/types";
import { IMeta } from "@/types/common";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all patients
    getAllPatients: build.query({
      query: (params?: Record<string, any>) => ({
        url: "/patient",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.patient],
      transformResponse: (response: Patient[], meta: IMeta) => {
        return {
          patients: response,
          meta,
        };
      },
    }),

    // Get single patient by ID
    getPatientById: build.query({
      query: (id: string) => ({
        url: `/patient/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.patient],
    }),

    // Update a patient by ID
    updatePatient: build.mutation({
      query: ({ id, data }: { id: string; data: Record<string, any> }) => ({
        url: `/patient/${id}`,
        method: "PATCH",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.patient, tagTypes.user],
    }),

    // Soft delete a patient by ID
    softDeletePatient: build.mutation({
      query: (id: string) => ({
        url: `/patient/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.patient],
    }),

    // Hard delete a patient by ID
    deletePatient: build.mutation({
      query: (id: string) => ({
        url: `/patient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.patient],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllPatientsQuery,
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
  useSoftDeletePatientMutation,
  useDeletePatientMutation,
} = patientApi;
