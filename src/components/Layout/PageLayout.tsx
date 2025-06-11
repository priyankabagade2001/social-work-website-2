import React from 'react';
import { Header, SimpleHeader } from '@/components/layout/Header';
import { Footer, NextJSFooter } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  /** Main content */
  children: React.ReactNode;
  /** Layout variant */
  variant?: 'default' | 'landing' | 'app' | 'docs' | 'centered' | 'fullscreen';
  /** Header configuration */
  header?: {
    show?: boolean;
    component?: React.ReactNode;
    props?: any;
  };
  /** Footer configuration */
  footer?: {
    show?: boolean;
    component?: React.ReactNode;
    props?: any;
  };
  /** Main content styling */
  main?: {
    className?: string;
    centered?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
    padding?: boolean;
  };
  /** Container styling */
  container?: {
    className?: string;
    fluid?: boolean;
  };
  /** Additional CSS classes */
  className?: string;
  /** Background pattern or styling */
  background?: 'default' | 'gradient' | 'grid' | 'dots' | 'none';
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({
    children,
    variant = 'default',
    header = { show: false },
    footer = { show: true },
    main = {},
    container = {},
    className,
    background = 'default',
    ...props
  }, ref) => {
    
    // Layout variants with different grid configurations
    const layoutVariants = {
      // Original Next.js template layout
      default: {
        container: "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20",
        main: "flex flex-col gap-[32px] row-start-2 items-center sm:items-start",
        footer: "row-start-3"
      },
      // Landing page with header
      landing: {
        container: "min-h-screen flex flex-col",
        main: "flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8",
        footer: "mt-auto"
      },
      // App layout with header and sidebar potential
      app: {
        container: "min-h-screen grid grid-rows-[auto_1fr_auto]",
        main: "container mx-auto px-4 sm:px-6 lg:px-8 py-8",
        footer: ""
      },
      // Documentation layout
      docs: {
        container: "min-h-screen grid grid-rows-[auto_1fr_auto]",
        main: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl",
        footer: ""
      },
      // Centered content layout
      centered: {
        container: "min-h-screen flex flex-col items-center justify-center p-4",
        main: "w-full max-w-md",
        footer: "mt-8"
      },
      // Fullscreen layout (no padding/margins)
      fullscreen: {
        container: "min-h-screen flex flex-col",
        main: "flex-1",
        footer: ""
      }
    };

    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md', 
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-full',
      none: ''
    };

    const backgroundVariants = {
      default: '',
      gradient: 'bg-gradient-to-br from-background via-background to-muted/20',
      grid: 'bg-grid-pattern',
      dots: 'bg-dots-pattern',
      none: ''
    };

    const layout = layoutVariants[variant];
    
    const containerClasses = cn(
      layout.container,
      backgroundVariants[background],
      'font-[family-name:var(--font-geist-sans)]', // Match original font
      container.fluid ? 'w-full' : '',
      container.className,
      className
    );

    const mainClasses = cn(
      layout.main,
      main.className,
      main.maxWidth ? maxWidthClasses[main.maxWidth] : '',
      main.centered && variant !== 'centered' ? 'mx-auto' : '',
      main.padding !== false && variant === 'fullscreen' ? 'p-4 sm:p-6 lg:p-8' : ''
    );

    // Render header if specified
    const renderHeader = () => {
      if (!header.show) return null;
      
      if (header.component) {
        return header.component;
      }
      
      return <SimpleHeader {...(header.props || {})} />;
    };

    // Render footer if specified
    const renderFooter = () => {
      if (!footer.show) return null;
      
      if (footer.component) {
        return footer.component;
      }
      
      // Use NextJSFooter for default variant, regular Footer for others
      if (variant === 'default') {
        return <NextJSFooter {...(footer.props || {})} />;
      }
      
      return <Footer variant="simple" {...(footer.props || {})} />;
    };

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {renderHeader()}
        
        <main className={mainClasses}>
          {children}
        </main>
        
        {renderFooter()}
      </div>
    );
  }
);

PageLayout.displayName = "PageLayout";

// Pre-built layout components for common use cases
export const DefaultLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <PageLayout variant="default" className={className}>
    {children}
  </PageLayout>
);

export const LandingLayout: React.FC<{
  children: React.ReactNode;
  showHeader?: boolean;
  headerProps?: any;
  className?: string;
}> = ({ children, showHeader = true, headerProps, className }) => (
  <PageLayout
    variant="landing"
    header={{ show: showHeader, props: headerProps }}
    footer={{ show: true }}
    background="gradient"
    className={className}
  >
    {children}
  </PageLayout>
);

export const AppLayout: React.FC<{
  children: React.ReactNode;
  headerProps?: any;
  footerProps?: any;
  className?: string;
}> = ({ children, headerProps, footerProps, className }) => (
  <PageLayout
    variant="app"
    header={{ show: true, props: headerProps }}
    footer={{ show: true, props: footerProps }}
    className={className}
  >
    {children}
  </PageLayout>
);

export const DocsLayout: React.FC<{
  children: React.ReactNode;
  headerProps?: any;
  className?: string;
}> = ({ children, headerProps, className }) => (
  <PageLayout
    variant="docs"
    header={{ show: true, props: headerProps }}
    footer={{ show: true }}
    main={{ maxWidth: '2xl' }}
    className={className}
  >
    {children}
  </PageLayout>
);

export const CenteredLayout: React.FC<{
  children: React.ReactNode;
  maxWidth?: PageLayoutProps['main']['maxWidth'];
  showFooter?: boolean;
  className?: string;
}> = ({ children, maxWidth = 'md', showFooter = false, className }) => (
  <PageLayout
    variant="centered"
    footer={{ show: showFooter }}
    main={{ maxWidth }}
    className={className}
  >
    {children}
  </PageLayout>
);

export const FullscreenLayout: React.FC<{
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}> = ({ children, showHeader = false, showFooter = false, className }) => (
  <PageLayout
    variant="fullscreen"
    header={{ show: showHeader }}
    footer={{ show: showFooter }}
    background="none"
    className={className}
  >
    {children}
  </PageLayout>
);

// Specialized layouts
export const AuthLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}> = ({ children, title, subtitle }) => (
  <CenteredLayout maxWidth="sm">
    <div className="text-center mb-8">
      {title && (
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </CenteredLayout>
);

export const ErrorLayout: React.FC<{
  children: React.ReactNode;
  showBackButton?: boolean;
}> = ({ children, showBackButton = true }) => (
  <CenteredLayout>
    {children}
    {showBackButton && (
      <div className="mt-6 text-center">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Go back
        </button>
      </div>
    )}
  </CenteredLayout>
);

// Layout context for nested components
export const LayoutContext = React.createContext<{
  variant: PageLayoutProps['variant'];
  hasHeader: boolean;
  hasFooter: boolean;
}>({
  variant: 'default',
  hasHeader: false,
  hasFooter: true
});

export const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a PageLayout');
  }
  return context;
};

export { PageLayout };