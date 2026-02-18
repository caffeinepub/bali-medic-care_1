import { Heart } from 'lucide-react';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'bali-medic-care';

  return (
    <footer className="bg-white border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5">
          © {currentYear} Bali Medic Care. Built with{' '}
          <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
