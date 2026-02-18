import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import PatientFormPage from './pages/PatientFormPage';
import DashboardPage from './pages/DashboardPage';
import TeamManagementPage from './pages/TeamManagementPage';
import SubmissionSuccessPage from './pages/SubmissionSuccessPage';
import ExamSuccessPage from './pages/ExamSuccessPage';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';

const rootRoute = createRootRoute({
  component: AppShell,
});

const patientFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PatientFormPage,
});

const submissionSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/success',
  component: SubmissionSuccessPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const teamManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team',
  component: () => (
    <ProtectedRoute>
      <TeamManagementPage />
    </ProtectedRoute>
  ),
});

const examSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam-success',
  component: () => (
    <ProtectedRoute>
      <ExamSuccessPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  patientFormRoute,
  submissionSuccessRoute,
  dashboardRoute,
  teamManagementRoute,
  examSuccessRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
