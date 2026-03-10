import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import type React from "react";
import AppLayout from "./components/AppLayout";
import { AuthContext, useAuthProvider } from "./hooks/useAuth";
import AIGuru from "./pages/AIGuru";
import Aarti from "./pages/Aarti";
import AartiDetail from "./pages/AartiDetail";
import AdminPanel from "./pages/AdminPanel";
import Bhajans from "./pages/Bhajans";
import Chalisa from "./pages/Chalisa";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Jap from "./pages/Jap";
import KathaDetail from "./pages/KathaDetail";
import Kathayen from "./pages/Kathayen";
import Mandir from "./pages/Mandir";
import Mantras from "./pages/Mantras";
import Panchang from "./pages/Panchang";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const japRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jap",
  component: Jap,
});
const aartiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/aarti",
  component: Aarti,
});
const aartiDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/aarti/$id",
  component: AartiDetail,
});
const mantrasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mantras",
  component: Mantras,
});
const bhajansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bhajans",
  component: Bhajans,
});
const chalisaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chalisa",
  component: Chalisa,
});
const panchangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panchang",
  component: Panchang,
});
const mandirRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mandir",
  component: Mandir,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: Community,
});
const aiGuruRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-guru",
  component: AIGuru,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});
const kathayenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kathayen",
  component: Kathayen,
});
const kathaDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/katha/$kathaId",
  component: KathaDetail,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});
const routeTree = rootRoute.addChildren([
  homeRoute,
  japRoute,
  aartiRoute,
  aartiDetailRoute,
  mantrasRoute,
  bhajansRoute,
  chalisaRoute,
  panchangRoute,
  mandirRoute,
  communityRoute,
  aiGuruRoute,
  profileRoute,
  kathayenRoute,
  kathaDetailRoute,
  adminRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
