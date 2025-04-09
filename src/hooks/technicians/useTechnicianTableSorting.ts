export type SortOption = "newest" | "oldest" | "nameAZ" | "nameZA" | "jobCountHigh" | "jobCountLow" | "revenueHigh" | "revenueLow" | "default";

export const useTechnicianTableSorting = () => {
  const sortTechnicians = (technicians, sortOption) => {
    switch (sortOption) {
      case "newest":
        return [...technicians].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest":
        return [...technicians].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "nameAZ":
        return [...technicians].sort((a, b) => a.name.localeCompare(b.name));
      case "nameZA":
        return [...technicians].sort((a, b) => b.name.localeCompare(a.name));
      case "jobCountHigh":
        return [...technicians].sort((a, b) => (b.jobCount || 0) - (a.jobCount || 0));
      case "jobCountLow":
        return [...technicians].sort((a, b) => (a.jobCount || 0) - (b.jobCount || 0));
      case "revenueHigh":
        return [...technicians].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
      case "revenueLow":
        return [...technicians].sort((a, b) => (a.revenue || 0) - (b.revenue || 0));
      default:
        return technicians;
    }
  };

  return { sortTechnicians };
};
