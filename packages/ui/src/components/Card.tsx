import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@eatsome/utils/src/cn';

const cardVariants = cva(
  "overflow-hidden transition-all",
  {
    variants: {
      variant: {
        standard: "bg-white border border-neutral-200 shadow-sm",
        elevated: "bg-white border border-neutral-200 shadow-md",
        flat: "bg-white border border-neutral-200",
        interactive: "cursor-pointer hover:translate-y-[-2px] hover:shadow-md"
      },
      elevation: {
        none: "",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-md",
        xl: "shadow-lg"
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6"
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "standard",
      elevation: "md",
      padding: "md",
      radius: "lg"
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  bgColor?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant,
  elevation,
  padding,
  radius,
  bgColor,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, elevation, padding, radius }),
        bgColor && `bg-${bgColor}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

// Sub-components for the Card system
export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export { Card, cardVariants }; 