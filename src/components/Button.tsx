"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary-hover text-primary-foreground border border-transparent shadow-sm hover:shadow",
        secondary: "bg-secondary hover:bg-secondary-hover text-secondary-foreground border border-transparent",
        outline: "border border-border hover:border-primary bg-transparent hover:bg-background-soft text-foreground hover:text-primary",
        ghost: "bg-transparent hover:bg-background-soft border border-transparent text-foreground hover:text-primary",
        link: "bg-transparent text-primary hover:text-primary-hover underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "text-sm px-4 h-10",
        sm: "text-xs px-3 h-8",
        lg: "text-base px-6 h-12",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, children, href, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    if (href && !asChild) {
      return (
        <a 
          href={href}
          className={buttonVariants({ variant, size, fullWidth, className })}
          {...(props as any)}
        >
          {children}
        </a>
      );
    }

    return (
      <Comp
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };