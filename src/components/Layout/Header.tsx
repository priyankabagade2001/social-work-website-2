import React from 'react';
import { Logo, BrandLogo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  /** Whether to show the logo */
  showLogo?: boolean;
  /** Logo configuration */
  logo?: {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    linkToHome?: boolean;
  };
  /** Navigation items */
  navigation?: NavigationItem[];
  /** Action buttons (CTA, login, etc.) */
  actions?: React.ReactNode;
  /** Whether header should be sticky */
  sticky?: boolean;
  /** Whether to show border bottom */
  bordered?: boolean;
  /** Custom background variant */
  variant?: 'default' | 'transparent' | 'blur';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show mobile menu toggle */
  showMobileMenu?: boolean;
  /** Mobile menu state */
  mobileMenuOpen?: boolean;
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: () => void;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({
    showLogo = true,
    logo = {},
    navigation = [],
    actions,
    sticky = false,
    bordered = false,
    variant = 'default',
    className,
    showMobileMenu = false,
    mobileMenuOpen = false,
    onMobileMenuToggle,
    ...props
  }, ref) => {
    const headerVariants = {
      default: "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      transparent: "bg-transparent",
      blur: "bg-background/80 backdrop-blur-md"
    };

    const headerClasses = cn(
      "w-full transition-all duration-200",
      headerVariants[variant],
      sticky && "sticky top-0 z-50",
      bordered && "border-b border-border",
      className
    );

    return (
      <header ref={ref} className={headerClasses} {...props}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            {showLogo && (
              <div className="flex-shrink-0">
                <BrandLogo
                  src={logo.src}
                  alt={logo.alt}
                  size={logo.size || 'md'}
                  linkToHome={logo.linkToHome !== false}
                />
              </div>
            )}

            {/* Desktop Navigation */}
            {navigation.length > 0 && (
              <nav className="hidden md:flex items-center space-x-8">
                {navigation.map((item, index) => (
                  <NavLink key={index} {...item} />
                ))}
              </nav>
            )}

            {/* Actions Section */}
            <div className="flex items-center space-x-4">
              {actions}
              
              {/* Mobile Menu Toggle */}
              {showMobileMenu && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={onMobileMenuToggle}
                  aria-label="Toggle mobile menu"
                >
                  <MenuIcon open={mobileMenuOpen} />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && navigation.length > 0 && (
            <MobileMenu
              items={navigation}
              open={mobileMenuOpen}
              onClose={() => onMobileMenuToggle?.()}
            />
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

// Navigation Link Component
const NavLink: React.FC<NavigationItem> = ({
  label,
  href,
  active = false,
  external = false,
  icon
}) => {
  const linkClasses = cn(
    "flex items-center space-x-1 text-sm font-medium transition-colors",
    "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-3 py-2",
    active 
      ? "text-foreground" 
      : "text-muted-foreground hover:text-foreground"
  );

  const linkProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a href={href} className={linkClasses} {...linkProps}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {external && (
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  );
};

// Mobile Menu Component
const MobileMenu: React.FC<{
  items: NavigationItem[];
  open: boolean;
  onClose: () => void;
}> = ({ items, open, onClose }) => {
  if (!open) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium transition-colors",
              item.active
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={onClose}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <span>{item.label}</span>
              {item.external && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// Hamburger Menu Icon
const MenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <div className="w-6 h-6 flex flex-col justify-center items-center">
    <div className={cn(
      "w-5 h-0.5 bg-current transition-all duration-300",
      open ? "rotate-45 translate-y-1" : "mb-1"
    )} />
    <div className={cn(
      "w-5 h-0.5 bg-current transition-all duration-300",
      open ? "opacity-0" : "mb-1"
    )} />
    <div className={cn(
      "w-5 h-0.5 bg-current transition-all duration-300",
      open ? "-rotate-45 -translate-y-1" : ""
    )} />
  </div>
);

// Pre-built header variants for common use cases
export const SimpleHeader: React.FC<{ 
  logoSrc?: string; 
  logoAlt?: string;
  className?: string;
}> = ({ logoSrc, logoAlt, className }) => (
  <Header
    logo={{ src: logoSrc, alt: logoAlt }}
    className={className}
  />
);

export const NavigationHeader: React.FC<{
  navigation: NavigationItem[];
  actions?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}> = ({ navigation, actions, sticky = true, className }) => (
  <Header
    navigation={navigation}
    actions={actions}
    sticky={sticky}
    bordered={true}
    showMobileMenu={true}
    className={className}
  />
);

export const LandingHeader: React.FC<{
  ctaButton?: React.ReactNode;
  className?: string;
}> = ({ ctaButton, className }) => (
  <Header
    variant="transparent"
    actions={ctaButton}
    className={className}
  />
);

export { Header };