import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { Payment } from "@/types";
import { IMeta } from "@/types/common";

export const BASE_STUDENT_SEMESTER_PAYMENT = "/student-semester-payments";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    initialPayment: build.mutation({
      query: (id: string) => ({
        url: `/payment/init-payment/${id}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.payment],
    }),

    getMyPaymentHistory: build.query({
      query: (args: Record<string, unknown>) => ({
        url: "/payment/my-history",
        method: "GET",
        params: args,
      }),
      transformResponse: (response: Payment[], meta: IMeta) => {
        return {
          payment: response,
          meta,
        };
      },
      providesTags: [tagTypes.payment],
    }),

    getSinglePayment: build.query({
      query: (id: string) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.payment],
    }),
  }),
});

export const {
  useInitialPaymentMutation,
  useGetMyPaymentHistoryQuery,
  useGetSinglePaymentQuery,
} = paymentApi;

export default paymentApi;
