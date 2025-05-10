import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Copy, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { JobSource } from "@/types/finance";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import CreateJobSourceModal from "@/components/jobSources/CreateJobSourceModal";
import EditJobSourceModal from "@/components/jobSources/EditJobSourceModal";

const jobSourcesData = [
  {
    id: "1",
    name: "Website",
    type: "Online",
    paymentType: "percentage",
    paymentValue: 10,
    isActive: true,
    totalJobs: 120,
    totalRevenue: 50000,
    profit: 20000,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Referral",
    type: "Word of Mouth",
    paymentType: "fixed",
    paymentValue: 50,
    isActive: false,
    totalJobs: 80,
    totalRevenue: 30000,
    profit: 12000,
    createdAt: "2023-03-20",
  },
  {
    id: "3",
    name: "Advertisement",
    type: "Print Media",
    paymentType: "percentage",
    paymentValue: 5,
    isActive: true,
    totalJobs: 60,
    totalRevenue: 25000,
    profit: 10000,
    createdAt: "2023-05-10",
  },
];

const JobSources = () => {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJobSource, setSelectedJobSource] = useState<JobSource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { setJobSources: setGlobalJobSources } = useGlobalState();

  useEffect(() => {
    // Ensure jobSources have the required 'active' property
    const fixedJobSources = jobSourcesData.map(source => ({
      ...source,
      active: source.isActive, // Map isActive to active for compatibility
    }));
    setJobSources(fixedJobSources);
    setGlobalJobSources(fixedJobSources);
  }, [setGlobalJobSources]);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (jobSource: JobSource) => {
    setSelectedJobSource(jobSource);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedJobSources = jobSources.filter((jobSource) => jobSource.id !== id);
    setJobSources(updatedJobSources);
    setGlobalJobSources(updatedJobSources);
    toast({
      title: "Success",
      description: "Job Source deleted successfully.",
    })
  };

  const handleDuplicate = (jobSource: JobSource) => {
    const duplicatedJobSource = {
      ...jobSource,
      id: uuidv4(),
      name: `${jobSource.name} Copy`,
    };
    const updatedJobSources = [...jobSources, duplicatedJobSource];
    setJobSources(updatedJobSources);
    setGlobalJobSources(updatedJobSources);
    toast({
      title: "Success",
      description: "Job Source duplicated successfully.",
    })
  };

  const filteredJobSources = jobSources.filter((jobSource) =>
    jobSource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="container py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Job Sources</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job Source
          </Button>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job sources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <Table>
            <TableCaption>A list of your job sources.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobSources.map((jobSource) => (
                <TableRow key={jobSource.id}>
                  <TableCell className="font-medium">{jobSource.name}</TableCell>
                  <TableCell>{jobSource.type}</TableCell>
                  <TableCell>{jobSource.paymentType}</TableCell>
                  <TableCell>{jobSource.paymentValue}</TableCell>
                  <TableCell>
                    {jobSource.active ? (
                      <Badge variant="outline">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(jobSource)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(jobSource)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the job source and remove its
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(jobSource.id)}>Delete</AlertDialogAction>
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
        </div>
      </div>

      <CreateJobSourceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        setJobSources={setJobSources}
      />
      <EditJobSourceModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        jobSource={selectedJobSource}
        setJobSources={setJobSources}
      />
    </div>
  );
};

export default JobSources;
