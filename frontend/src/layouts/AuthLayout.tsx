import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </main>
  );
}