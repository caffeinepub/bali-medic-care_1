import { Globe, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function AppFooter() {
  const socialLinks = [
    {
      label: 'Website',
      icon: Globe,
      href: 'https://www.balimediccare.com',
    },
    {
      label: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/balimediccare/',
    },
    {
      label: 'Facebook',
      icon: Facebook,
      href: 'https://www.facebook.com/profile.php?id=61586628193595',
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/62818588911',
    },
  ];

  return (
    <footer className="bg-white border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{link.label}</span>
                </a>
              );
            })}
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 Bali Medic Care
          </p>
        </div>
      </div>
    </footer>
  );
}
