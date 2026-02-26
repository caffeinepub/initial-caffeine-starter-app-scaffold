import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Panchang from './pages/Panchang';
import Jap from './pages/Jap';
import Mandir from './pages/Mandir';
import Profile from './pages/Profile';
import Community from './pages/Community';
import AartiDetail from './pages/AartiDetail';
import AdminPanel from './pages/AdminPanel';
import AIGuru from './pages/AIGuru';
import Kathayen from './pages/Kathayen';
import KathaDetail from './pages/KathaDetail';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Create root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const panchangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/panchang',
  component: Panchang,
});

const japRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jap',
  component: Jap,
});

const mandirRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mandir',
  component: Mandir,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community',
  component: Community,
});

const aartiDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/aarti/$id',
  component: AartiDetail,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const aiGuruRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-guru',
  component: AIGuru,
});

const kathayenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kathayen',
  component: Kathayen,
});

const kathaDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kathayen/$id',
  component: KathaDetail,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  panchangRoute,
  japRoute,
  mandirRoute,
  profileRoute,
  communityRoute,
  aartiDetailRoute,
  adminRoute,
  aiGuruRoute,
  kathayenRoute,
  kathaDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
