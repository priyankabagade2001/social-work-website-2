import React from 'react';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

export interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  ariaHidden?: boolean;
}

export interface FooterSection {
  title?: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** Footer links - can be flat array or grouped sections */
  links?: FooterLink[];
  /** Grouped footer sections */
  sections?: FooterSection[];
  /** Whether to show logo in footer */
  showLogo?: boolean;
  /** Logo configuration */
  logo?: {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
  };
  /** Copyright text */
  copyright?: string;
  /** Additional footer content */
  children?: React.ReactNode;
  /** Layout variant */
  variant?: 'simple' | 'detailed' | 'minimal';
  /** Custom CSS classes */
  className?: string;
  /** Grid positioning (for CSS Grid layouts) */
  gridPosition?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({
    links = [],
    sections = [],
    showLogo = false,
    logo = {},
    copyright,
    children,
    variant = 'simple',
    className,
    gridPosition = 'row-start-3',
    ...props
  }, ref) => {
    const footerVariants = {
      simple: "flex gap-6 flex-wrap items-center justify-center",
      detailed: "grid grid-cols-1 md:grid-cols-4 gap-8",
      minimal: "flex items-center justify-between"
    };

    const footerClasses = cn(
      gridPosition,
      "w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-border bg-background/50",
      className
    );

    const contentClasses = cn(
      "container mx-auto",
      footerVariants[variant]
    );

    return (
      <footer ref={ref} className={footerClasses} {...props}>
        <div className={contentClasses}>
          {variant === 'simple' && (
            <SimpleFooterContent 
              links={links}
              showLogo={showLogo}
              logo={logo}
              copyright={copyright}
            />
          )}
          
          {variant === 'detailed' && (
            <DetailedFooterContent
              sections={sections}
              links={links}
              showLogo={showLogo}
              logo={logo}
              copyright={copyright}
            />
          )}
          
          {variant === 'minimal' && (
            <MinimalFooterContent
              links={links}
              showLogo={showLogo}
              logo={logo}
              copyright={copyright}
            />
          )}
          
          {children}
        </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";

// Simple footer content (matches your original layout)
const SimpleFooterContent: React.FC<{
  links: FooterLink[];
  showLogo?: boolean;
  logo?: FooterProps['logo'];
  copyright?: string;
}> = ({ links, showLogo, logo, copyright }) => (
  <>
    {showLogo && (
      <div className="w-full flex justify-center mb-4">
        <Logo
          src={logo?.src}
          alt={logo?.alt}
          size={logo?.size || 'sm'}
          linkToHome={true}
        />
      </div>
    )}
    
    {links.map((link, index) => (
      <FooterLink key={index} {...link} />
    ))}
    
    {copyright && (
      <div className="w-full text-center text-xs text-muted-foreground mt-4">
        {copyright}
      </div>
    )}
  </>
);

// Detailed footer with sections
const DetailedFooterContent: React.FC<{
  sections: FooterSection[];
  links: FooterLink[];
  showLogo?: boolean;
  logo?: FooterProps['logo'];
  copyright?: string;
}> = ({ sections, links, showLogo, logo, copyright }) => (
  <>
    {showLogo && (
      <div className="md:col-span-1">
        <Logo
          src={logo?.src}
          alt={logo?.alt}
          size={logo?.size || 'md'}
          linkToHome={true}
          className="mb-4"
        />
      </div>
    )}
    
    {sections.map((section, index) => (
      <div key={index} className="space-y-3">
        {section.title && (
          <h3 className="font-semibold text-sm text-foreground">
            {section.title}
          </h3>
        )}
        <ul className="space-y-2">
          {section.links.map((link, linkIndex) => (
            <li key={linkIndex}>
              <FooterLink {...link} variant="stacked" />
            </li>
          ))}
        </ul>
      </div>
    ))}
    
    {/* Standalone links if no sections provided */}
    {sections.length === 0 && links.length > 0 && (
      <div className="md:col-span-full flex flex-wrap gap-6 justify-center">
        {links.map((link, index) => (
          <FooterLink key={index} {...link} />
        ))}
      </div>
    )}
    
    {copyright && (
      <div className="md:col-span-full text-center text-xs text-muted-foreground pt-4 border-t border-border">
        {copyright}
      </div>
    )}
  </>
);

// Minimal footer content
const MinimalFooterContent: React.FC<{
  links: FooterLink[];
  showLogo?: boolean;
  logo?: FooterProps['logo'];
  copyright?: string;
}> = ({ links, showLogo, logo, copyright }) => (
  <>
    <div className="flex items-center space-x-4">
      {showLogo && (
        <Logo
          src={logo?.src}
          alt={logo?.alt}
          size={logo?.size || 'sm'}
          linkToHome={true}
        />
      )}
      {copyright && (
        <span className="text-xs text-muted-foreground">
          {copyright}
        </span>
      )}
    </div>
    
    <div className="flex items-center space-x-4">
      {links.map((link, index) => (
        <FooterLink key={index} {...link} variant="minimal" />
      ))}
    </div>
  </>
);

// Individual footer link component
const FooterLink: React.FC<FooterLink & { variant?: 'default' | 'stacked' | 'minimal' }> = ({
  label,
  href,
  icon,
  external = false,
  ariaHidden = false,
  variant = 'default'
}) => {
  const linkClasses = cn(
    "inline-flex items-center gap-2 text-sm transition-colors",
    "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
    {
      'text-muted-foreground hover:underline hover:underline-offset-4': variant === 'default',
      'text-muted-foreground hover:text-foreground': variant === 'stacked',
      'text-muted-foreground hover:text-foreground text-xs': variant === 'minimal'
    }
  );

  const linkProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      className={linkClasses}
      aria-hidden={ariaHidden}
      {...linkProps}
    >
      {icon && (
        <span className="w-4 h-4 flex-shrink-0" aria-hidden={ariaHidden}>
          {icon}
        </span>
      )}
      <span>{label}</span>
      {external && (
        <svg 
          className="w-3 h-3 opacity-50" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
          />
        </svg>
      )}
    </a>
  );
};

// Pre-built footer variants matching your original design
export const NextJSFooter: React.FC<{ className?: string }> = ({ className }) => {
  const defaultLinks: FooterLink[] = [
    {
      label: "Learn",
      href: "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
      external: true,
      icon: (
        <Image
          aria-hidden
          src="/file.svg"
          alt="File icon"
          width={16}
          height={16}
        />
      )
    },
    {
      label: "Examples",
      href: "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
      external: true,
      icon: (
        <Image
          aria-hidden
          src="/window.svg"
          alt="Window icon"
          width={16}
          height={16}
        />
      )
    },
    {
      label: "Go to nextjs.org →",
      href: "https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
      external: true,
      icon: (
        <Image
          aria-hidden
          src="/globe.svg"
          alt="Globe icon"
          width={16}
          height={16}
        />
      )
    }
  ];

  return (
    <Footer
      links={defaultLinks}
      variant="simple"
      className={className}
    />
  );
};

export const CompanyFooter: React.FC<{
  sections?: FooterSection[];
  copyright?: string;
  className?: string;
}> = ({ sections = [], copyright, className }) => (
  <Footer
    sections={sections}
    showLogo={true}
    copyright={copyright}
    variant="detailed"
    className={className}
  />
);

export const MinimalFooter: React.FC<{
  links?: FooterLink[];
  copyright?: string;
  className?: string;
}> = ({ links = [], copyright, className }) => (
  <Footer
    links={links}
    copyright={copyright}
    variant="minimal"
    className={className}
  />
);

export { Footer };