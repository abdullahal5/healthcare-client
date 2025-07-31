import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPrescriptions: build.query({
      query: () => ({
        url: "/prescription",
        method: "GET",
      }),
      providesTags: [tagTypes.prescription],
    }),
    getPrescriptionByAppointment: build.query({
      query: (appointmentId: string) => ({
        url: `/prescription/${appointmentId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.prescription],
    }),

    getMyPrescriptions: build.query({
      query: () => ({
        url: "/prescription/my-prescription",
        method: "GET",
      }),
      providesTags: [tagTypes.prescription],
    }),

    updatePrescription: build.mutation({
      query: ({ id, data }) => ({
        url: `/prescription/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.prescription],
    }),

    createPrescription: build.mutation({
      query: (data) => ({
        url: "/prescription",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.prescription],
    }),
  }),
});

export const {
  useGetAllPrescriptionsQuery,
  useGetMyPrescriptionsQuery,
  useGetPrescriptionByAppointmentQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
} = prescriptionApi;
