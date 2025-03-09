
interface JobFilterInfoBarProps {
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const JobFilterInfoBar = ({
  filteredCount,
  totalCount,
  hasActiveFilters,
  clearFilters
}: JobFilterInfoBarProps) => {
  if (!hasActiveFilters) {
    return null;
  }
  
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} jobs
      </p>
      <button 
        onClick={clearFilters}
        className="text-sm text-primary hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default JobFilterInfoBar;
