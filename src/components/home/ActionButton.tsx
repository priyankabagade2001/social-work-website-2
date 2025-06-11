import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ActionButtonConfig {
  /** Button text/label */
  label: string;
  /** Button href */
  href: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'sm' | 'default' | 'lg';
  /** Button width behavior */
  width?: 'auto' | 'full' | 'fixed';
  /** Icon configuration */
  icon?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    position?: 'left' | 'right';
    className?: string;
  };
  /** Whether link is external */
  external?: boolean;
  /** Custom target attribute */
  target?: string;
  /** Custom rel attribute */
  rel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface ActionButtonsProps {
  /** Array of button configurations */
  buttons: ActionButtonConfig[];
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Gap between buttons */
  gap?: 'sm' | 'md' | 'lg';
  /** Container width */
  width?: 'auto' | 'full';
  /** Additional container classes */
  className?: string;
  /** Responsive behavior */
  responsive?: {
    mobile?: 'stack' | 'scroll' | 'wrap';
    tablet?: 'row' | 'column';
  };
}

const ActionButtons = React.forwardRef<HTMLDivElement, ActionButtonsProps>(
  ({
    buttons,
    direction = 'horizontal',
    align = 'center',
    gap = 'md',
    width = 'auto',
    className,
    responsive = { mobile: 'stack', tablet: 'row' },
    ...props
  }, ref) => {
    const gapClasses = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    };

    const alignClasses = {
      start: 'justify-start items-start',
      center: 'justify-center items-center',
      end: 'justify-end items-end',
      stretch: 'justify-stretch items-stretch'
    };

    const containerClasses = cn(
      'flex',
      gapClasses[gap],
      alignClasses[align],
      {
        'flex-col': direction === 'vertical',
        'flex-row': direction === 'horizontal',
        'w-full': width === 'full',
        'w-auto': width === 'auto',
        // Responsive classes
        'flex-col sm:flex-row': responsive.mobile === 'stack' && direction === 'horizontal',
        'flex-row flex-wrap': responsive.mobile === 'wrap',
        'flex-row overflow-x-auto': responsive.mobile === 'scroll'
      },
      className
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {buttons.map((button, index) => (
          <ActionButton key={index} {...button} />
        ))}
      </div>
    );
  }
);

ActionButtons.displayName = "ActionButtons";

// Individual Action Button Component
const ActionButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ActionButtonConfig>(
  ({
    label,
    href,
    variant = 'primary',
    size = 'default',
    width = 'auto',
    icon,
    external = false,
    target,
    rel,
    className,
    loading = false,
    disabled = false,
    onClick,
    ...props
  }, ref) => {
    // Auto-detect external links
    const isExternal = external || href.startsWith('http') || href.startsWith('//');
    
    // Set default target and rel for external links
    const finalTarget = target || (isExternal ? '_blank' : undefined);
    const finalRel = rel || (isExternal ? 'noopener noreferrer' : undefined);

    const buttonContent = (
      <>
        {icon && icon.position !== 'right' && (
          <Image
            src={icon.src}
            alt={icon.alt}
            width={icon.width || 20}
            height={icon.height || 20}
            className={cn("flex-shrink-0", icon.className)}
          />
        )}
        <span>{label}</span>
        {icon && icon.position === 'right' && (
          <Image
            src={icon.src}
            alt={icon.alt}
            width={icon.width || 20}
            height={icon.height || 20}
            className={cn("flex-shrink-0", icon.className)}
          />
        )}
      </>
    );

    return (
      <Button
        ref={ref as any}
        variant={variant}
        size={size}
        width={width}
        href={href}
        target={finalTarget}
        rel={finalRel}
        className={className}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

// Pre-built action button sets matching your original design
export const NextJSActionButtons: React.FC<{ className?: string }> = ({ className }) => {
  const buttons: ActionButtonConfig[] = [
    {
      label: "Deploy now",
      href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
      variant: "primary",
      external: true,
      icon: {
        src: "/vercel.svg",
        alt: "Vercel logomark",
        width: 20,
        height: 20,
        className: "dark:invert"
      }
    },
    {
      label: "Read our docs",
      href: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
      variant: "secondary",
      width: "fixed",
      external: true
    }
  ];

  return (
    <ActionButtons
      buttons={buttons}
      direction="horizontal"
      align="center"
      gap="md"
      responsive={{ mobile: 'stack' }}
      className={className}
    />
  );
};

export const CTAButtons: React.FC<{
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}> = ({
  primaryLabel = "Get Started",
  primaryHref = "/signup",
  secondaryLabel = "Learn More",
  secondaryHref = "/docs",
  className
}) => {
  const buttons: ActionButtonConfig[] = [
    {
      label: primaryLabel,
      href: primaryHref,
      variant: "primary"
    },
    {
      label: secondaryLabel,
      href: secondaryHref,
      variant: "secondary"
    }
  ];

  return (
    <ActionButtons
      buttons={buttons}
      direction="horizontal"
      align="center"
      gap="md"
      responsive={{ mobile: 'stack' }}
      className={className}
    />
  );
};

export const SocialButtons: React.FC<{
  buttons: Array<{
    platform: string;
    href: string;
    iconSrc: string;
  }>;
  className?: string;
}> = ({ buttons, className }) => {
  const socialButtons: ActionButtonConfig[] = buttons.map(button => ({
    label: `Follow on ${button.platform}`,
    href: button.href,
    variant: "ghost" as const,
    size: "icon" as const,
    external: true,
    icon: {
      src: button.iconSrc,
      alt: `${button.platform} icon`,
      width: 20,
      height: 20
    }
  }));

  return (
    <ActionButtons
      buttons={socialButtons}
      direction="horizontal"
      align="center"
      gap="sm"
      className={className}
    />
  );
};

export const AuthButtons: React.FC<{
  showLogin?: boolean;
  showSignup?: boolean;
  loginHref?: string;
  signupHref?: string;
  className?: string;
}> = ({
  showLogin = true,
  showSignup = true,
  loginHref = "/login",
  signupHref = "/signup",
  className
}) => {
  const buttons: ActionButtonConfig[] = [];
  
  if (showLogin) {
    buttons.push({
      label: "Log in",
      href: loginHref,
      variant: "ghost"
    });
  }
  
  if (showSignup) {
    buttons.push({
      label: "Sign up",
      href: signupHref,
      variant: "primary"
    });
  }

  return (
    <ActionButtons
      buttons={buttons}
      direction="horizontal"
      align="center"
      gap="sm"
      className={className}
    />
  );
};

export const LoadingButtons: React.FC<{
  buttons: ActionButtonConfig[];
  loadingStates: boolean[];
  className?: string;
}> = ({ buttons, loadingStates, className }) => {
  const buttonsWithLoading = buttons.map((button, index) => ({
    ...button,
    loading: loadingStates[index] || false
  }));

  return (
    <ActionButtons
      buttons={buttonsWithLoading}
      className={className}
    />
  );
};

export { ActionButtons, ActionButton };