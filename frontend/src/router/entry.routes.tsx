import type { AppRouteObject } from "@/router/route-types";
import RequireRole from "@/router/guards/RequireRole";
import EntryLayout from "@/layouts/EntryLayout";
import { PATHS } from "@/router/paths";

function EntryDashboardPage() {
  return <div>Entry Dashboard</div>;
}

export const entryRoutes: AppRouteObject[] = [
  {
    element: <RequireRole allowedRoles={["Entry"]} />,
    children: [
        {
        path: PATHS.entry,
        element: <EntryLayout />,
        children: [
            {
            index: true,
            element: <EntryDashboardPage />,
            },
        ],
        },
    ],
  },
];