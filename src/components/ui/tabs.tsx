
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "purple" | "blue" | "amber" | "red"
    badge?: number
  }
>(({ className, variant = "default", badge, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      
      // Default styling
      variant === "default" && "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      
      // Purple variant
      variant === "purple" && "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:shadow-sm",
      
      // Blue variant
      variant === "blue" && "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm",
      
      // Amber variant
      variant === "amber" && "data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:shadow-sm",
      
      // Red variant
      variant === "red" && "data-[state=active]:bg-red-100 data-[state=active]:text-red-800 data-[state=active]:shadow-sm",
      
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-1.5">
      {props.children}
      {typeof badge === 'number' && (
        <span className={cn(
          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium",
          variant === "default" && "bg-gray-200 text-gray-700",
          variant === "purple" && "bg-purple-100 text-purple-800",
          variant === "blue" && "bg-blue-100 text-blue-800",
          variant === "amber" && "bg-amber-100 text-amber-800",
          variant === "red" && "bg-red-100 text-red-800",
        )}>
          {badge}
        </span>
      )}
    </div>
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
