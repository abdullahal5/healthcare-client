import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { UserStatus } from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: (params?: Record<string, unknown>) => ({
        url: "/user",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.user],
    }),

    getSingleUser: build.query({
      query: (args: Record<string, unknown>) => ({
        url: "/user/me",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.user],
    }),

    createAdmin: build.mutation({
      query: (formData: FormData) => ({
        url: "/user/create-admin",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    createDoctor: build.mutation({
      query: (formData: FormData) => ({
        url: "/user/create-doctor",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    createPatient: build.mutation({
      query: (formData: FormData) => ({
        url: "/user/create-patient",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    changeStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/user/status/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: [tagTypes.user, tagTypes.doctor, tagTypes.patient],
    }),

    updateMyProfile: build.mutation({
      query: (formData: FormData) => ({
        url: "/user/update-my-profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useCreateAdminMutation,
  useCreateDoctorMutation,
  useCreatePatientMutation,
  useChangeStatusMutation,
  useUpdateMyProfileMutation,
} = userApi;
