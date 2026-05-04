import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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


// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }),
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: () => 'hotels',
    }),
    addLocation: build.mutation({
      query: (location) => ({
        url: 'locations',
        method: 'POST',
        body: {
          name: location.name,
        },
      }),
    }),
    getAllLocations: build.query({
      query: () => 'locations',
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllHotelsQuery, useAddLocationMutation, useGetAllLocationsQuery } = api