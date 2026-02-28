import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Panchang from './pages/Panchang';
import Jap from './pages/Jap';
import Aarti from './pages/Aarti';
import AartiDetail from './pages/AartiDetail';
import Community from './pages/Community';
import Kathayen from './pages/Kathayen';
import KathaDetail from './pages/KathaDetail';
import Mandir from './pages/Mandir';
import AIGuru from './pages/AIGuru';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Mantras from './pages/Mantras';
import Bhajans from './pages/Bhajans';
import Chalisa from './pages/Chalisa';
import VratDashboard from './pages/VratDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const panchangRoute = createRoute({ getParentRoute: () => rootRoute, path: '/panchang', component: Panchang });
const japRoute = createRoute({ getParentRoute: () => rootRoute, path: '/jap', component: Jap });
const aartiRoute = createRoute({ getParentRoute: () => rootRoute, path: '/aarti', component: Aarti });
const aartiDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/aarti/$id', component: AartiDetail });
const communityRoute = createRoute({ getParentRoute: () => rootRoute, path: '/community', component: Community });
const kathayenRoute = createRoute({ getParentRoute: () => rootRoute, path: '/kathayen', component: Kathayen });
const kathaDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/katha/$id', component: KathaDetail });
const mandirRoute = createRoute({ getParentRoute: () => rootRoute, path: '/mandir', component: Mandir });
const aiGuruRoute = createRoute({ getParentRoute: () => rootRoute, path: '/ai-guru', component: AIGuru });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminPanel });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: Profile });
const mantrasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/mantras', component: Mantras });
const bhajansRoute = createRoute({ getParentRoute: () => rootRoute, path: '/bhajans', component: Bhajans });
const chalisaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/chalisa', component: Chalisa });
const vratDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/vrat-dashboard', component: VratDashboard });

const routeTree = rootRoute.addChildren([
  homeRoute,
  panchangRoute,
  japRoute,
  aartiRoute,
  aartiDetailRoute,
  communityRoute,
  kathayenRoute,
  kathaDetailRoute,
  mandirRoute,
  aiGuruRoute,
  adminRoute,
  profileRoute,
  mantrasRoute,
  bhajansRoute,
  chalisaRoute,
  vratDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
