import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 " +
          "dark:bg-primary-dark dark:text-primary-foreground dark:hover:bg-primary-dark/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 " +
          "dark:bg-destructive-dark dark:text-destructive-foreground dark:hover:bg-destructive-dark/90",
        outline:
          "border border-border bg-background text-primary hover:bg-secondary-light hover:text-secondary-foreground " +
          "dark:border-border-dark dark:bg-background-dark dark:text-primary-dark dark:hover:bg-secondary-dark dark:hover:text-secondary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 " +
          "dark:bg-secondary-dark dark:text-secondary-foreground dark:hover:bg-secondary-dark/80",
        ghost:
          "hover:bg-secondary-light hover:text-secondary-foreground " +
          "dark:hover:bg-secondary-dark dark:hover:text-secondary-foreground",
        link:
          "text-primary underline-offset-4 hover:underline " +
          "dark:text-primary-dark",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
