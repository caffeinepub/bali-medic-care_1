import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileSetupDialog from './ProfileSetupDialog';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, loginStatus, login } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      // Optionally redirect to home or show access denied
    }
  }, [isInitializing, isAuthenticated, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-8 text-center">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Medical Team Access Only</h1>
          <p className="text-muted-foreground mb-6">
            This area is restricted to medical team members. Please log in with your credentials to access the dashboard and patient management tools.
          </p>
          <Button onClick={login} className="w-full">
            Medical Team Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog />
      {children}
    </>
  );
}
