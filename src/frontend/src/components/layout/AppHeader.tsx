import { useNavigate, useRouterState } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function AppHeader() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const currentPath = routerState.location.pathname;
  const isPatientView = currentPath === '/' || currentPath === '/success';
  const isDashboardView = currentPath.startsWith('/dashboard') || currentPath.startsWith('/team') || currentPath.startsWith('/exam-success');

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/generated/bali-medic-care-logo-v2.dim_512x512.png" 
              alt="Bali Medic Care" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg">BALI MEDIC CARE</span>
          </button>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => navigate({ to: '/' })}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isPatientView ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  PATIENT
                </button>
                <button
                  onClick={() => navigate({ to: '/dashboard' })}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isDashboardView ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  MEDICAL TEAM
                </button>
              </div>
            )}
            <LoginButton showOnPatientPages={!isPatientView || isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
}
