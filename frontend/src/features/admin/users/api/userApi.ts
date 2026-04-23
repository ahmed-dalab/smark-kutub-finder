import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import type { User } from "../types/user.types";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Entry";
  isActive: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "Admin" | "Entry";
  isActive?: boolean;
}
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
 console.log("userApi token:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/users/",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "/users/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, { id: string; body: UpdateUserRequest }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    toggleUserStatus: builder.mutation<User, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation
} = userApi;