import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const getAllHotels = async () => {
//   try {
//     const res = await fetch("http://localhost:8000/api/hotels", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch hotels");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const getAllLocations = async () => {
//   try {
//     const res = await fetch("http://localhost:8000/api/locations", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch locations");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export { getAllHotels, getAllLocations };

const waitForClerkSession = async () => {
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const clerk = window.Clerk;
    if (clerk?.session) {
      return clerk.session;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return null;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Bookings", "Hotels", "Locations"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL
      ? `${import.meta.env.VITE_BACKEND_URL}/api/`
      : "http://localhost:8000/api/",
    prepareHeaders: async (headers) => {
      const session = await waitForClerkSession();
      const token = await session?.getToken({ skipCache: true });

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: (params = {}) => ({
        url: "hotels",
        params,
      }),
      providesTags: ["Hotels"],
    }),
    getHotelById: build.query({
      query: (id) => `hotels/${id}`,
    }),
    createHotel: build.mutation({
      query: ({ payload, token }) => ({
        url: "hotels",
        method: "POST",
        body: payload,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }),
      invalidatesTags: ["Hotels", "Locations"],
    }),
    addLocation: build.mutation({
      query: (location) => ({
        url: "locations",
        method: "POST",
        body: {
          name: location.name,
        },
      }),
    }),
    addReview: build.mutation({
      query: (review) => ({
        url: "reviews",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Locations"],
    }),
    createBooking: build.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
      invalidatesTags: ["Bookings"],
    }),
    getBookingsByUserId: build.query({
      query: (userId) => `bookings/user/${userId}`,
      providesTags: ["Bookings"],
    }),
    getBookingById: build.query({
      query: (bookingId) => `bookings/${bookingId}`,
      providesTags: ["Bookings"],
    }),
    confirmCheckoutSession: build.mutation({
      query: (sessionId) => ({
        url: "payments/confirm-checkout-session",
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Bookings"],
    }),
    cancelBooking: build.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings"],
    }),
    getHotelsBySearchQuery: build.query({
      query: (search) => ({
        url: "hotels",
        params: { search },
      }),
    }),
    getAiHotelRecommendations: build.mutation({
      query: (query) => ({
        url: "hotels/ai",
        method: "POST",
        body: { query },
      }),
    }),
    getAllLocations: build.query({
      query: () => "locations",
      providesTags: ["Locations"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useAddReviewMutation,
  useCreateBookingMutation,
  useGetBookingsByUserIdQuery,
  useGetBookingByIdQuery,
  useConfirmCheckoutSessionMutation,
  useCancelBookingMutation,
  useGetHotelsBySearchQuery,
  useGetAiHotelRecommendationsMutation,
} = api;
