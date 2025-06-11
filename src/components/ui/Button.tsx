import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants using CVA (Class Variance Authority)
const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center gap-2 rounded-full border border-solid transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background border-transparent hover:bg-[#383838] dark:hover:bg-[#ccc]",
        secondary: "border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground",
        link: "border-transparent underline-offset-4 hover:underline text-primary"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 text-sm sm:h-12 sm:px-5 sm:text-base",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10"
      },
      width: {
        auto: "w-auto",
        full: "w-full",
        fixed: "w-full sm:w-auto md:w-[158px]"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      width: "auto"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    width,
    asChild = false,
    href,
    target,
    rel,
    icon,
    iconPosition = 'left',
    loading = false,
    loadingText,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = href ? 'a' : 'button';
    const isDisabled = disabled || loading;

    const content = (
      <>
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && icon && iconPosition === 'right' && icon}
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(buttonVariants({ variant, size, width, className }))}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };