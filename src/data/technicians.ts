
import { Technician } from "@/types/technician";
import { getInitials } from "@/lib/utils";

// Create sample technicians with all required properties
const createSampleTechnicians = (): Technician[] => {
  const sampleData: Technician[] = [
    {
      id: "tech-1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "555-123-4567",
      specialty: "HVAC Specialist",
      hireDate: "2023-01-15",
      status: "active",
      paymentType: "percentage",
      paymentRate: 30,
      hourlyRate: 25,
      completedJobs: 42,
      cancelledJobs: 3,
      totalRevenue: 28500,
      rating: 4.8,
      department: "Installation",
      position: "Lead Technician",
      category: "HVAC",
    },
    {
      id: "tech-2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "555-987-6543",
      specialty: "Electrician",
      hireDate: "2023-03-22",
      status: "active",
      paymentType: "hourly",
      paymentRate: 25,
      hourlyRate: 28,
      completedJobs: 37,
      cancelledJobs: 2,
      totalRevenue: 31200,
      rating: 4.9,
      department: "Electrical",
      position: "Senior Technician",
      category: "Electrical",
    },
    {
      id: "tech-3",
      name: "Michael Rodriguez",
      email: "m.rodriguez@example.com",
      phone: "555-456-7890",
      specialty: "Plumbing",
      hireDate: "2023-02-10",
      status: "active",
      paymentType: "flat",
      paymentRate: 200,
      hourlyRate: 22,
      completedJobs: 29,
      cancelledJobs: 5,
      totalRevenue: 19800,
      rating: 4.5,
      department: "Plumbing",
      position: "Junior Technician",
      category: "Plumbing",
    }
  ];

  // Add initials to all technicians
  return sampleData.map(tech => ({
    ...tech,
    initials: getInitials(tech.name)
  }));
};

export const technicians = createSampleTechnicians();

// Export the same array as initialTechnicians for consistent reference
export const initialTechnicians = technicians;
