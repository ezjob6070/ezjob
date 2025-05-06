
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

export function useServiceCategory() {
  const { serviceCategory, setServiceCategory } = useGlobalState();
  
  return {
    serviceCategory,
    setServiceCategory,
    isFiltered: serviceCategory !== "All Services",
    clearFilter: () => setServiceCategory("All Services")
  };
}
