
import { Technician } from "@/types/technician";

export const technicians: Technician[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Springfield, IL",
    specialty: "Plumbing",
    status: "active",
    paymentType: "percentage",
    paymentRate: 60,
    hireDate: "2021-03-15", // Convert Date to string
    completedJobs: 148,
    cancelledJobs: 7,
    totalRevenue: 28750,
    rating: 4.8,
    initials: "JS"
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 234-5678",
    address: "456 Elm St, Springfield, IL",
    specialty: "Electrical",
    status: "active",
    paymentType: "flat",
    paymentRate: 120,
    hireDate: "2022-01-10", // Convert Date to string
    completedJobs: 87,
    cancelledJobs: 3,
    totalRevenue: 18900,
    rating: 4.9,
    initials: "EJ"
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "+1 (555) 345-6789",
    address: "789 Oak St, Springfield, IL",
    specialty: "HVAC",
    status: "inactive",
    paymentType: "hourly",
    paymentRate: 35,
    hireDate: "2020-08-22", // Convert Date to string
    completedJobs: 215,
    cancelledJobs: 12,
    totalRevenue: 32400,
    rating: 4.6,
    initials: "MD"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 456-7890",
    address: "101 Pine St, Springfield, IL",
    specialty: "Carpentry",
    status: "active",
    paymentType: "percentage",
    paymentRate: 55,
    hireDate: "2021-11-05", // Convert Date to string
    completedJobs: 92,
    cancelledJobs: 5,
    totalRevenue: 19850,
    rating: 4.7,
    initials: "SW"
  },
  {
    id: "5",
    name: "David Thompson",
    email: "david.thompson@example.com",
    phone: "+1 (555) 567-8901",
    address: "202 Cedar St, Springfield, IL",
    specialty: "Painting",
    status: "onLeave",
    paymentType: "flat",
    paymentRate: 95,
    hireDate: "2022-04-18", // Convert Date to string
    completedJobs: 68,
    cancelledJobs: 2,
    totalRevenue: 14300,
    rating: 4.8,
    initials: "DT"
  },
  {
    id: "6",
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    phone: "+1 (555) 678-9012",
    address: "303 Maple St, Springfield, IL",
    specialty: "Flooring",
    status: "active",
    paymentType: "hourly",
    paymentRate: 32,
    hireDate: "2021-07-30", // Convert Date to string
    completedJobs: 124,
    cancelledJobs: 8,
    totalRevenue: 22600,
    rating: 4.5,
    initials: "JB"
  },
  {
    id: "7",
    name: "Robert Miller",
    email: "robert.miller@example.com",
    phone: "+1 (555) 789-0123",
    address: "404 Birch St, Springfield, IL",
    specialty: "Roofing",
    status: "active",
    paymentType: "percentage",
    paymentRate: 65,
    hireDate: "2020-12-15", // Convert Date to string
    completedJobs: 178,
    cancelledJobs: 10,
    totalRevenue: 38200,
    rating: 4.9,
    initials: "RM"
  }
];
