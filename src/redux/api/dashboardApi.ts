import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    dashboardData: build.query({
      query: () => ({
        url: `/meta`,
        method: "GET",
      }),
      providesTags: [
        tagTypes.specialties,
        tagTypes.admin,
        tagTypes.doctor,
        tagTypes.patient,
        tagTypes.schedule,
        tagTypes.appointment,
        tagTypes.doctorSchedule,
        tagTypes.user,
        tagTypes.prescription,
        tagTypes.review,
        tagTypes.payment,
      ],
    }),
  }),
});

export const { useDashboardDataQuery } = authApi;
