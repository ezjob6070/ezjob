
// This hook provides a workaround for component type issues with badge variants
// It maps string values to valid badge variants to avoid type errors

// Define allowed variants for badges
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const useBadgeVariant = () => {
  // Map any status string to a valid badge variant
  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "success":
        return "default"; // Map 'success' to 'default'
      case "warning":
        return "secondary"; // Map 'warning' to 'secondary'
      case "error":
        return "destructive"; // Keep 'destructive' as is
      default:
        return "outline"; // Default to 'outline'
    }
  };

  return { getBadgeVariant };
};
