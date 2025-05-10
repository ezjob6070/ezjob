
import { format, addDays, subDays } from 'date-fns';

// Get today's date
const today = new Date();

// Helper for creating dates
const dateString = (date: Date) => format(date, 'yyyy-MM-dd');

// Create milestone types
type Milestone = {
  title: string;
  date: string;
  completed: boolean;
};

// Create team member type
type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
};

// Project type
export type Project = {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  status: "In Progress" | "Completed" | "On Hold" | "Planned";
  client: string;
  budget: number;
  startDate: string;
  endDate: string;
  completion: number;
  milestones?: Milestone[];
  team?: TeamMember[];
  materials?: {
    name: string;
    quantity: number;
    cost: number;
  }[];
};

// Sample projects data
export const projects: Project[] = [
  {
    id: "1",
    name: "Downtown Office Renovation",
    description: "Complete renovation of 3-story office building including new electrical, plumbing, and HVAC systems.",
    type: "Commercial Renovation",
    location: "123 Main St, Downtown",
    status: "In Progress",
    client: "Acme Corporation",
    budget: 450000,
    startDate: dateString(subDays(today, 45)),
    endDate: dateString(addDays(today, 3)), // Urgent project approaching deadline
    completion: 92,
    milestones: [
      {
        title: "Demolition completed",
        date: dateString(subDays(today, 30)),
        completed: true
      },
      {
        title: "Electrical rough-in",
        date: dateString(subDays(today, 14)),
        completed: true
      },
      {
        title: "Final inspection",
        date: dateString(addDays(today, 2)),
        completed: false
      }
    ],
    team: [
      { id: "t1", name: "John Smith", role: "Project Manager" },
      { id: "t2", name: "Maria Garcia", role: "Electrical Supervisor" },
      { id: "t3", name: "David Chen", role: "Plumbing Contractor" },
      { id: "t4", name: "Sarah Johnson", role: "Interior Designer" }
    ],
    materials: [
      { name: "Electrical Supplies", quantity: 1, cost: 45000 },
      { name: "Plumbing Fixtures", quantity: 1, cost: 32000 },
      { name: "Drywall & Framing", quantity: 1, cost: 28000 },
      { name: "Flooring", quantity: 5000, cost: 75000 }
    ]
  },
  {
    id: "2",
    name: "Riverside Luxury Condos",
    description: "New construction of 24-unit luxury condominium complex with underground parking and rooftop amenities.",
    type: "New Construction - Residential",
    location: "456 River View Dr",
    status: "In Progress",
    client: "Riverside Developments LLC",
    budget: 8500000,
    startDate: dateString(subDays(today, 180)),
    endDate: dateString(addDays(today, 120)),
    completion: 65,
    milestones: [
      {
        title: "Foundation complete",
        date: dateString(subDays(today, 150)),
        completed: true
      },
      {
        title: "Framing complete",
        date: dateString(subDays(today, 90)),
        completed: true
      },
      {
        title: "Mechanical systems",
        date: dateString(today), // Today's milestone
        completed: false
      },
      {
        title: "Interior finishing",
        date: dateString(addDays(today, 60)),
        completed: false
      }
    ],
    team: [
      { id: "t5", name: "Robert Williams", role: "Senior Project Manager" },
      { id: "t6", name: "Emily Rodriguez", role: "Site Supervisor" },
      { id: "t7", name: "Michael Lee", role: "Structural Engineer" }
    ]
  },
  {
    id: "3",
    name: "Greenfield Industrial Park",
    description: "Development of industrial park with 5 warehouse buildings and supporting infrastructure.",
    type: "Industrial Development",
    location: "789 Industry Way",
    status: "In Progress",
    client: "JKL Industrial Partners",
    budget: 12700000,
    startDate: dateString(subDays(today, 220)),
    endDate: dateString(addDays(today, 160)),
    completion: 40,
    team: [
      { id: "t8", name: "Thomas Brown", role: "Development Manager" },
      { id: "t9", name: "Jennifer Kim", role: "Civil Engineer" },
      { id: "t10", name: "Carlos Mendez", role: "Construction Supervisor" }
    ]
  },
  {
    id: "4",
    name: "City Center Plaza Renovation",
    description: "Renovation of public plaza including new landscaping, fountains, and seating areas.",
    type: "Public Space",
    location: "100 City Center",
    status: "Completed",
    client: "City of Metropolis",
    budget: 2100000,
    startDate: dateString(subDays(today, 150)),
    endDate: dateString(subDays(today, 20)),
    completion: 100
  },
  {
    id: "5",
    name: "Highland Shopping Mall",
    description: "Construction of 50,000 sq ft shopping center with 25 retail spaces and food court.",
    type: "Commercial - Retail",
    location: "5000 Highland Ave",
    status: "On Hold",
    client: "Highland Retail Group",
    budget: 9800000,
    startDate: dateString(subDays(today, 90)),
    endDate: dateString(addDays(today, 240)),
    completion: 15
  },
  {
    id: "6",
    name: "Metro Transit Hub",
    description: "Construction of multi-modal transit center connecting bus, light rail, and subway systems.",
    type: "Public Transportation",
    location: "Union Square",
    status: "In Progress",
    client: "Metropolitan Transit Authority",
    budget: 25000000,
    startDate: dateString(subDays(today, 300)),
    endDate: dateString(addDays(today, 6)), // Approaching deadline
    completion: 78,
    milestones: [
      {
        title: "Site preparation",
        date: dateString(subDays(today, 280)),
        completed: true
      },
      {
        title: "Foundation work",
        date: dateString(subDays(today, 250)),
        completed: true
      },
      {
        title: "Structural steel",
        date: dateString(subDays(today, 180)),
        completed: true
      },
      {
        title: "Mechanical systems",
        date: dateString(subDays(today, 60)),
        completed: true
      },
      {
        title: "Interior finishing",
        date: dateString(today), // Today's milestone
        completed: false
      }
    ]
  },
  {
    id: "7",
    name: "Sunrise Medical Center",
    description: "New 120-bed hospital with emergency department, operating rooms, and specialized care wings.",
    type: "Healthcare",
    location: "800 Health Parkway",
    status: "In Progress",
    client: "Regional Healthcare System",
    budget: 78000000,
    startDate: dateString(subDays(today, 400)),
    endDate: dateString(addDays(today, 200)),
    completion: 55
  },
  {
    id: "8",
    name: "Westside Elementary School",
    description: "Construction of new elementary school with classrooms, cafeteria, gymnasium, and playgrounds.",
    type: "Education",
    location: "200 Learning Lane",
    status: "In Progress",
    client: "Westside School District",
    budget: 18500000,
    startDate: dateString(subDays(today, 180)),
    endDate: dateString(addDays(today, 5)), // Urgent project
    completion: 70
  }
];

export default projects;
