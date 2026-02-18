import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useRouterState } from '@tanstack/react-router';

interface LoginButtonProps {
  showOnPatientPages?: boolean;
}

export default function LoginButton({ showOnPatientPages = true }: LoginButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const routerState = useRouterState();

  const isAuthenticated = !!identity;
  const isLoading = loginStatus === 'logging-in' || loginStatus === 'initializing';
  
  const currentPath = routerState.location.pathname;
  const isPatientPage = currentPath === '/' || currentPath === '/success';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  // Hide login button on patient pages when not authenticated
  if (isPatientPage && !isAuthenticated && !showOnPatientPages) {
    return null;
  }

  // Show medical team specific label on patient pages
  const loginLabel = isPatientPage && !isAuthenticated ? 'Medical Team Login' : 'Login';

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoading}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loginStatus === 'initializing' ? 'Loading...' : 'Logging in...'}
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          {loginLabel}
        </>
      )}
    </Button>
  );
}
