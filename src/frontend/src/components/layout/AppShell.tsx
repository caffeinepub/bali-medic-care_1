import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
