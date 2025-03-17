
// Dashboard activity and event data
export const dashboardActivities = [
  {
    id: "1",
    type: "call" as const,
    title: "Phone call with John Doe",
    time: "2 hours ago",
    user: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    client: {
      name: "John Doe",
      initials: "JD",
    },
  },
  {
    id: "2",
    type: "email" as const,
    title: "Sent proposal to Tech Solutions Inc.",
    time: "Yesterday",
    user: {
      name: "Sarah Miller",
      initials: "SM",
    },
    client: {
      name: "Tech Solutions Inc.",
      initials: "TS",
    },
  },
  {
    id: "3",
    type: "meeting" as const,
    title: "Project kickoff meeting",
    time: "2 days ago",
    user: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    client: {
      name: "Acme Corp",
      initials: "AC",
    },
  },
  {
    id: "4",
    type: "task" as const,
    title: "Updated client information",
    time: "3 days ago",
    user: {
      name: "Sarah Miller",
      initials: "SM",
    },
  },
];

export const dashboardEvents = [
  {
    id: "1",
    title: "Client Meeting",
    datetime: new Date(new Date().setHours(new Date().getHours() + 2)),
    type: "meeting" as const,
    clientName: "Acme Corp",
  },
  {
    id: "2",
    title: "Follow-up Call",
    datetime: new Date(new Date().setHours(new Date().getHours() + 5)),
    type: "call" as const,
    clientName: "John Doe",
  },
  {
    id: "3",
    title: "Proposal Deadline",
    datetime: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: "deadline" as const,
    clientName: "Tech Solutions Inc.",
  },
];

export const dashboardTaskCounts = {
  joby: 5,
  inProgress: 21,
  submitted: 8,
  draft: 12,
  completed: 19,
  canceled: 3
};

export const dashboardFinancialMetrics = {
  totalRevenue: 125000,
  companysCut: 25000,
  pendingInvoices: 15000,
  avgJobValue: 2500,
  monthlyGrowth: 8.5,
  conversionRate: 24
};

export const dashboardLeadSources = [
  { name: "Website", value: 35 },
  { name: "Referrals", value: 25 },
  { name: "Social Media", value: 20 },
  { name: "Direct", value: 15 },
  { name: "Other", value: 5 }
];

export const dashboardJobTypePerformance = [
  { name: "Maintenance", value: 45 },
  { name: "Installation", value: 30 },
  { name: "Consulting", value: 15 },
  { name: "Emergency", value: 10 }
];

export const dashboardTopTechnicians = [
  { name: "Sarah Miller", jobs: 45, revenue: 78500, rating: 4.9 },
  { name: "Alex Johnson", jobs: 38, revenue: 62000, rating: 4.8 },
  { name: "James Wilson", jobs: 36, revenue: 59000, rating: 4.7 },
  { name: "Emily Brown", jobs: 32, revenue: 53000, rating: 4.9 }
];

export const detailedTasksData = [
  { title: "Scheduled maintenance at Acme Corp", client: "Acme Corp", dueDate: "Today", status: "In Progress", priority: "High" },
  { title: "Installation of HVAC system", client: "Tech Solutions Inc.", dueDate: "Tomorrow", status: "Pending", priority: "Medium" },
  { title: "Follow-up call with John Doe", client: "John Doe", dueDate: "Sep 15, 2023", status: "Completed", priority: "Low" },
  { title: "Repair leaking pipes", client: "Sarah Wilson", dueDate: "Sep 16, 2023", status: "In Progress", priority: "High" },
  { title: "Quote for office renovation", client: "GlobalTech", dueDate: "Sep 18, 2023", status: "Pending", priority: "Medium" },
  { title: "Annual maintenance checkup", client: "City Hospital", dueDate: "Sep 20, 2023", status: "Scheduled", priority: "Medium" },
  { title: "Emergency electrical repair", client: "Downtown Mall", dueDate: "Yesterday", status: "Completed", priority: "High" },
  { title: "Security system installation", client: "First Bank", dueDate: "Sep 25, 2023", status: "Scheduled", priority: "High" }
];

export const detailedLeadsData = [
  { name: "John Smith", company: "ABC Corp", email: "john@abccorp.com", value: 3500, status: "New" },
  { name: "Mary Johnson", company: "Tech Innovators", email: "mary@techinnovators.com", value: 12000, status: "Qualified" },
  { name: "Robert Lee", company: "Global Services", email: "robert@globalservices.com", value: 7500, status: "Contacting" },
  { name: "Patricia Brown", company: "Local Business", email: "patricia@localbusiness.com", value: 2000, status: "New" },
  { name: "Michael Davis", company: "Enterprise Solutions", email: "michael@enterprise.com", value: 15000, status: "Qualified" },
  { name: "Elizabeth Wilson", company: "Smart Systems", email: "elizabeth@smartsystems.com", value: 9000, status: "Contacting" }
];

export const detailedRevenueData = [
  { number: "INV-2023-001", client: "Acme Corp", date: "Sep 10, 2023", amount: 5000, status: "Paid" },
  { number: "INV-2023-002", client: "Tech Solutions Inc.", date: "Sep 12, 2023", amount: 3500, status: "Pending" },
  { number: "INV-2023-003", client: "John Doe", date: "Sep 15, 2023", amount: 1200, status: "Paid" },
  { number: "INV-2023-004", client: "GlobalTech", date: "Sep 18, 2023", amount: 7500, status: "Overdue" },
  { number: "INV-2023-005", client: "City Hospital", date: "Sep 20, 2023", amount: 12000, status: "Pending" },
  { number: "INV-2023-006", client: "First Bank", date: "Sep 25, 2023", amount: 9500, status: "Paid" }
];

export const detailedClientsData = [
  { name: "Acme Corp", email: "contact@acmecorp.com", projects: 8, totalValue: 48000, status: "Active" },
  { name: "Tech Solutions Inc.", email: "info@techsolutions.com", projects: 5, totalValue: 32500, status: "Active" },
  { name: "John Doe", email: "john.doe@example.com", projects: 2, totalValue: 3500, status: "Active" },
  { name: "GlobalTech", email: "contact@globaltech.com", projects: 3, totalValue: 29000, status: "Inactive" },
  { name: "City Hospital", email: "admin@cityhospital.org", projects: 1, totalValue: 15000, status: "Active" },
  { name: "First Bank", email: "info@firstbank.com", projects: 4, totalValue: 42000, status: "Active" }
];

export const detailedBusinessMetrics = [
  { label: "Average Job Value", value: "$2,500", change: 5.2 },
  { label: "Monthly Growth", value: "8.5%", change: 2.1 },
  { label: "Conversion Rate", value: "24%", change: 3.5 },
  { label: "Customer Satisfaction", value: "4.8/5", change: 0.3 },
  { label: "Average Response Time", value: "2.5 hours", change: -10.5 },
  { label: "Repeat Business Rate", value: "73%", change: 5.8 },
  { label: "Team Efficiency", value: "87%", change: 4.2 },
  { label: "Cost per Acquisition", value: "$320", change: -7.5 }
];
