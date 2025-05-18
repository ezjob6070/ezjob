import { WrenchIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IndustryType } from "@/components/sidebar/sidebarTypes";

// This component is no longer needed as we're only using the service category
// We're keeping it as a simple nullish component to prevent type errors
const IndustrySelector = ({
  activeIndustry,
  onIndustryChange
}: {
  activeIndustry?: IndustryType;
  onIndustryChange?: (industry: IndustryType) => void;
}) => {
  return null;
};

export default IndustrySelector;
