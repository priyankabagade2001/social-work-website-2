import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  /** Logo source path */
  src?: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Logo width */
  width?: number;
  /** Logo height */
  height?: number;
  /** Whether to invert colors in dark mode */
  invertOnDark?: boolean;
  /** Whether logo should be clickable and link to home */
  linkToHome?: boolean;
  /** Custom href for logo link */
  href?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  /** Additional CSS classes */
  className?: string;
  /** Loading priority for Next.js Image */
  priority?: boolean;
  /** Whether to show loading placeholder */
  loading?: boolean;
  /** Custom onClick handler */
  onClick?: () => void;
}

// Predefined size configurations
const sizeConfig = {
  sm: { width: 100, height: 20 },
  md: { width: 140, height: 28 },
  lg: { width: 180, height: 38 }, // Default from your original code
  xl: { width: 220, height: 48 },
  custom: { width: undefined, height: undefined }
};

const Logo = React.forwardRef<HTMLElement, LogoProps>(
  ({
    src = '/next.svg',
    alt = 'Logo',
    width,
    height,
    invertOnDark = true,
    linkToHome = false,
    href = '/',
    size = 'lg',
    className,
    priority = false,
    loading = false,
    onClick,
    ...props
  }, ref) => {
    // Use custom dimensions or size preset
    const dimensions = size === 'custom' 
      ? { width: width || 180, height: height || 38 }
      : sizeConfig[size];

    const finalWidth = width || dimensions.width;
    const finalHeight = height || dimensions.height;

    const logoClasses = cn(
      "transition-opacity duration-200",
      invertOnDark && "dark:invert",
      loading && "opacity-50",
      onClick && "cursor-pointer hover:opacity-80",
      className
    );

    const logoElement = (
      <Image
        src={src}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        priority={priority}
        className={logoClasses}
        onClick={onClick}
        {...props}
      />
    );

    // Wrap in link if specified
    if (linkToHome || href !== '/') {
      return (
        <Link 
          href={href} 
          className="inline-block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {logoElement}
        </Link>
      );
    }

    return logoElement;
  }
);

Logo.displayName = "Logo";

// Additional logo variants for specific use cases
export const NextLogo = React.forwardRef<HTMLElement, Omit<LogoProps, 'src' | 'alt'>>(
  (props, ref) => (
    <Logo
      ref={ref}
      src="/next.svg"
      alt="Next.js logo"
      {...props}
    />
  )
);

export const VercelLogo = React.forwardRef<HTMLElement, Omit<LogoProps, 'src' | 'alt'>>(
  (props, ref) => (
    <Logo
      ref={ref}
      src="/vercel.svg"
      alt="Vercel logomark"
      size="sm"
      width={20}
      height={20}
      {...props}
    />
  )
);

// Brand logo component with additional styling
export const BrandLogo = React.forwardRef<HTMLElement, LogoProps>(
  ({ className, ...props }, ref) => (
    <Logo
      ref={ref}
      className={cn("select-none", className)}
      linkToHome={true}
      priority={true}
      {...props}
    />
  )
);

// Loading skeleton for logo
export const LogoSkeleton: React.FC<{ size?: LogoProps['size'] }> = ({ 
  size = 'lg' 
}) => {
  const dimensions = sizeConfig[size];
  
  return (
    <div
      className="animate-pulse bg-muted rounded"
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    />
  );
};

export { Logo };