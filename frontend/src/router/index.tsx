import { createBrowserRouter } from "react-router";
import { authRoutes } from "@/router/auth.routes";
import { adminRoutes } from "@/router/admin.routes";
import { entryRoutes } from "@/router/entry.routes";
import { commonRoutes } from "@/router/common.routes";
import { protectedRoutes } from "./protected.routes";

export const router = createBrowserRouter([
  ...commonRoutes,
  ...authRoutes,
  ...protectedRoutes
]);