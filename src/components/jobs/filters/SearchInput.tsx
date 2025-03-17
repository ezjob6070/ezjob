
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  updateFilter: (key: string, value: string) => void;
}

const SearchInput = ({ searchTerm, updateFilter }: SearchInputProps) => {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search jobs..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => updateFilter("searchTerm", e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
