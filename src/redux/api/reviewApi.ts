import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { Review } from "@/types";
import { IMeta } from "@/types/common";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createReview: build.mutation({
      query: (data) => ({
        url: "/review",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.review],
    }),

    getAllReviews: build.query({
      query: (args: Record<string, any>) => ({
        url: "/review",
        method: "GET",
        params: args,
      }),
      transformResponse: (response: Review[], meta: IMeta) => {
        return {
          reviews: response,
          meta,
        };
      },
      providesTags: [tagTypes.review],
    }),
  }),
});

export const { useCreateReviewMutation, useGetAllReviewsQuery } = reviewApi;
