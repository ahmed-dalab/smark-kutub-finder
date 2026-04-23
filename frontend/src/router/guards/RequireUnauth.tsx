import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/app/hooks";

export default function RequireUnauth() {
  const { isAuthenticated, isBootstrapping, user } = useAppSelector(
    (state) => state.auth
  );

  if (isBootstrapping) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    if (user?.role === "Admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user?.role === "Entry") {
      return <Navigate to="/entry" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}