
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Edit, Trash, FileInput, Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { technicians } from "@/data/technicians";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import { EditTechnicianModal } from "@/components/technicians/EditTechnicianModal";
import TechnicianCard from "@/components/technicians/TechnicianCard";
import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

// Define SortOption directly in this file to avoid conflicts
type SortOption = 
  | "name-asc" 
  | "name-desc" 
  | "rating-high" 
  | "rating-low" 
  | "revenue-high" 
  | "revenue-low"
  | "hourly-high"
  | "hourly-low";

export default function TechnicianAltercation() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  const windowSize = useWindowSize();
  const isMobile = windowSize.width && windowSize.width < 768;

  const specialties = [...new Set(technicians.map((tech) => tech.specialty))];
  const statuses = [...new Set(technicians.map((tech) => tech.status))];

  const filteredTechnicians = technicians.filter((technician) => {
    const searchRegex = new RegExp(searchValue, "i");
    const matchesSearch = searchRegex.test(technician.name) || searchRegex.test(technician.email) || (technician.phone && searchRegex.test(technician.phone));
    const matchesSpecialty = selectedSpecialties.length === 0 || selectedSpecialties.includes(technician.specialty);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(technician.status);

    return matchesSearch && matchesSpecialty && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "revenue-high":
        return b.totalRevenue - a.totalRevenue;
      case "revenue-low":
        return a.totalRevenue - b.totalRevenue;
      case "hourly-high":
        // Safely compare hourly rates
        if (a.paymentType === "hourly" && b.paymentType === "hourly") {
          return b.paymentRate - a.paymentRate;
        }
        return 0;
      case "hourly-low":
        // Safely compare hourly rates
        if (a.paymentType === "hourly" && b.paymentType === "hourly") {
          return a.paymentRate - b.paymentRate;
        }
        return 0;
      default:
        return 0;
    }
  });

  const handleSelectTech = (id: string) => {
    setSelectedTech((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((techId) => techId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectSpecialty = (specialty: string) => {
    setSelectedSpecialties((prevSelected) => {
      if (prevSelected.includes(specialty)) {
        return prevSelected.filter((s) => s !== specialty);
      } else {
        return [...prevSelected, specialty];
      }
    });
  };

  const handleSelectStatus = (status: string) => {
    setSelectedStatuses((prevSelected) => {
      if (prevSelected.includes(status)) {
        return prevSelected.filter((s) => s !== status);
      } else {
        return [...prevSelected, status];
      }
    });
  };

  const handleDeleteTech = () => {
    toast({
      title: "Technician deleted.",
      description: "Your technician has been deleted from the system.",
    });
  };

  const handleEditOpen = (id: string) => {
    setSelectedTechnician(id);
    setEditOpen(true);
  };

  // Find the currently selected technician for edit
  const technicianToEdit = selectedTechnician 
    ? technicians.find(tech => tech.id === selectedTechnician) || null
    : null;

  // Mock handler for technician update
  const handleUpdateTechnician = (updatedTechnician: any) => {
    toast({
      title: "Technician updated successfully",
      description: `${updatedTechnician.name} has been updated.`
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Technicians</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Technician
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Technician</DialogTitle>
              <DialogDescription>
                Add a new technician to the system.
              </DialogDescription>
            </DialogHeader>
            <AddTechnicianModal open={open} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Input
          type="search"
          placeholder="Search technicians..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("name-asc")}>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name-desc")}>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("rating-high")}>Rating (High to Low)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("rating-low")}>Rating (Low to High)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("revenue-high")}>Revenue (High to Low)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("revenue-low")}>Revenue (Low to High)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("hourly-high")}>Hourly Rate (High to Low)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("hourly-low")}>Hourly Rate (Low to High)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Filter By Specialty
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter By Specialty</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72 w-full">
              {specialties.map((specialty) => (
                <DropdownMenuItem key={specialty} className="p-2">
                  <Label htmlFor={specialty} className="peer-disabled:cursor-not-allowed flex items-center justify-between w-full">
                    {specialty}
                    <Checkbox
                      id={specialty}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => handleSelectSpecialty(specialty)}
                    />
                  </Label>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Filter By Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72 w-full">
              {statuses.map((status) => (
                <DropdownMenuItem key={status} className="p-2">
                  <Label htmlFor={status} className="peer-disabled:cursor-not-allowed flex items-center justify-between w-full">
                    {status}
                    <Checkbox
                      id={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => handleSelectStatus(status)}
                    />
                  </Label>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredTechnicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              selected={selectedTech.includes(technician.id)}
              onSelect={() => handleSelectTech(technician.id)}
              onClick={() => handleEditOpen(technician.id)}
            />
          ))}
        </div>
      ) : (
        <Table className="mt-4">
          <TableCaption>A list of your technicians.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedTech.length === filteredTechnicians.length && filteredTechnicians.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTech(filteredTechnicians.map((tech) => tech.id));
                    } else {
                      setSelectedTech([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnicians.map((technician) => (
              <TableRow key={technician.id}>
                <TableCell className="font-medium">
                  <Checkbox
                    checked={selectedTech.includes(technician.id)}
                    onCheckedChange={() => handleSelectTech(technician.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{technician.name}</TableCell>
                <TableCell>{technician.email}</TableCell>
                <TableCell>{technician.phone}</TableCell>
                <TableCell>{technician.specialty}</TableCell>
                <TableCell>{technician.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditOpen(technician.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your technician
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteTech}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {technicianToEdit && (
        <EditTechnicianModal
          open={editOpen}
          onOpenChange={setEditOpen}
          technician={technicianToEdit}
          onUpdateTechnician={handleUpdateTechnician}
        />
      )}
    </div>
  );
}
