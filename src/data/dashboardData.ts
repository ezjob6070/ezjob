
import { DateRange } from "react-day-picker";

// Enhanced dashboard task counts with realistic numbers
export const dashboardTaskCounts = {
  joby: 0,
  inProgress: 24,
  submitted: 18,
  completed: 42,
  canceled: 8,
  rescheduled: 6
};

// Enhanced financial metrics with realistic figures
export const dashboardFinancialMetrics = {
  totalRevenue: 148750,
  companysCut: 74375,
  avgJobValue: 3542,
  monthlyGrowth: 8.7,
  conversionRate: 68.5
};

// Lead source data to populate the dashboard
export const dashboardLeadSources = [
  { name: "Website", value: 45, percentage: 32 },
  { name: "Referral", value: 36, percentage: 25 },
  { name: "Phone", value: 28, percentage: 19 },
  { name: "Social Media", value: 18, percentage: 13 },
  { name: "Email", value: 16, percentage: 11 }
];

// Job type performance data
export const dashboardJobTypePerformance = [
  { name: "Repair", value: 35, revenue: 89600, avgValue: 2560 },
  { name: "Installation", value: 28, revenue: 126000, avgValue: 4500 },
  { name: "Maintenance", value: 22, revenue: 33000, avgValue: 1500 },
  { name: "Consultation", value: 10, revenue: 15000, avgValue: 1500 }
];

// Top technicians data
export const dashboardTopTechnicians = [
  { name: "Michael Rodriguez", jobs: 18, revenue: 62500, rating: 4.9, avatar: "" },
  { name: "Sarah Johnson", jobs: 15, revenue: 54200, rating: 4.8, avatar: "" },
  { name: "David Williams", jobs: 14, revenue: 48300, rating: 4.7, avatar: "" },
  { name: "Emily Garcia", jobs: 12, revenue: 43800, rating: 4.9, avatar: "" }
];

// Recent activities for dashboard
export const dashboardActivities = [
  { id: "act1", type: "task" as const, title: "Completed AC Repair", time: "2 hours ago", user: { name: "Michael Rodriguez", initials: "MR" } },
  { id: "act2", type: "task" as const, title: "Started Water Heater Installation", time: "4 hours ago", user: { name: "Sarah Johnson", initials: "SJ" } },
  { id: "act3", type: "meeting" as const, title: "Rescheduled Duct Cleaning", time: "yesterday", user: { name: "David Williams", initials: "DW" } },
  { id: "act4", type: "email" as const, title: "Created Electrical Inspection", time: "yesterday", user: { name: "Emily Garcia", initials: "EG" } },
  { id: "act5", type: "task" as const, title: "Assigned Plumbing Emergency", time: "2 days ago", user: { name: "System", initials: "SY" }, client: { name: "Sarah Johnson", initials: "SJ" } }
];

// Upcoming events
export const dashboardEvents = [
  { id: "evt1", title: "Team Meeting", datetime: new Date(new Date().setHours(new Date().getHours() + 24)), type: "meeting" as const },
  { id: "evt2", title: "Supplier Meeting", datetime: new Date(new Date().setDate(new Date().getDate() + 3)), type: "meeting" as const, clientName: "Parts Supplier Inc." },
  { id: "evt3", title: "Training Session", datetime: new Date(new Date().setDate(new Date().getDate() + 5)), type: "deadline" as const }
];

// Detailed job data by status
export const jobsByStatus = {
  completed: [
    { id: "JOB-1001", client: "Reynolds Family", address: "123 Oak St", taskType: "AC Repair", technician: "Michael Rodriguez", date: "2023-05-01", amount: 780 },
    { id: "JOB-1004", client: "Garcia Home", address: "321 Elm St", taskType: "HVAC Installation", technician: "Sarah Johnson", date: "2023-05-01", amount: 3400 },
    { id: "JOB-1007", client: "Williams Apartment", address: "159 Spruce Dr", taskType: "Appliance Repair", technician: "David Williams", date: "2023-05-02", amount: 245 },
    { id: "JOB-1010", client: "Wilson Home", address: "802 Redwood Way", taskType: "Insulation", technician: "Emily Garcia", date: "2023-05-02", amount: 1870 }
  ],
  inProgress: [
    { id: "JOB-1002", client: "Martin Residence", address: "456 Pine Ave", taskType: "Plumbing", technician: "Sarah Johnson", date: "2023-05-02", amount: 450 },
    { id: "JOB-1008", client: "Davis Family", address: "753 Walnut Ct", taskType: "Duct Cleaning", technician: "Michael Rodriguez", date: "2023-05-03", amount: 550 }
  ],
  submitted: [
    { id: "JOB-1003", client: "Franklin Building", address: "789 Maple Rd", taskType: "Electrical", technician: "Emily Garcia", date: "2023-05-03", amount: 1200 },
    { id: "JOB-1005", client: "Thompson Office", address: "654 Cedar Ln", taskType: "Commercial HVAC", technician: "David Williams", date: "2023-05-04", amount: 4800 },
    { id: "JOB-1009", client: "Miller Building", address: "426 Fir Pl", taskType: "Commercial Electric", technician: "Sarah Johnson", date: "2023-05-04", amount: 2750 }
  ],
  canceled: [
    { id: "JOB-1006", client: "Johnson Residence", address: "987 Birch Blvd", taskType: "Water Heater", technician: "Michael Rodriguez", date: "2023-05-01", amount: 1350, reason: "Client cancelled due to emergency" }
  ],
  rescheduled: [
    { id: "JOB-1011", client: "Parker Home", address: "345 Pine St", taskType: "HVAC Maintenance", technician: "David Williams", date: "2023-05-03", newDate: "2023-05-10", amount: 320 },
    { id: "JOB-1012", client: "Adams Office", address: "567 Oak Ave", taskType: "Electrical Panel", technician: "Emily Garcia", date: "2023-05-04", newDate: "2023-05-12", amount: 890 }
  ]
};

// Detailed tasks data for dialog
export const detailedTasksData = [
  { id: "JOB-1001", client: "Reynolds Family", address: "123 Oak St", taskType: "AC Repair", status: "completed", date: "2023-05-01", amount: 780 },
  { id: "JOB-1002", client: "Martin Residence", address: "456 Pine Ave", taskType: "Plumbing", status: "in_progress", date: "2023-05-02", amount: 450 },
  { id: "JOB-1003", client: "Franklin Building", address: "789 Maple Rd", taskType: "Electrical", status: "scheduled", date: "2023-05-03", amount: 1200 },
  { id: "JOB-1004", client: "Garcia Home", address: "321 Elm St", taskType: "HVAC Installation", status: "completed", date: "2023-05-01", amount: 3400 },
  { id: "JOB-1005", client: "Thompson Office", address: "654 Cedar Ln", taskType: "Commercial HVAC", status: "scheduled", date: "2023-05-04", amount: 4800 },
  { id: "JOB-1006", client: "Johnson Residence", address: "987 Birch Blvd", taskType: "Water Heater", status: "canceled", date: "2023-05-01", amount: 1350 },
  { id: "JOB-1007", client: "Williams Apartment", address: "159 Spruce Dr", taskType: "Appliance Repair", status: "completed", date: "2023-05-02", amount: 245 },
  { id: "JOB-1008", client: "Davis Family", address: "753 Walnut Ct", taskType: "Duct Cleaning", status: "in_progress", date: "2023-05-03", amount: 550 },
  { id: "JOB-1009", client: "Miller Building", address: "426 Fir Pl", taskType: "Commercial Electric", status: "scheduled", date: "2023-05-04", amount: 2750 },
  { id: "JOB-1010", client: "Wilson Home", address: "802 Redwood Way", taskType: "Insulation", status: "completed", date: "2023-05-02", amount: 1870 }
];

// Detailed leads data for dialog
export const detailedLeadsData = [
  { id: "LEAD-501", name: "Jennifer Adams", contact: "jennifer@email.com", source: "Website", service: "HVAC", status: "New", date: "2023-05-01", notes: "Interested in AC replacement" },
  { id: "LEAD-502", name: "Robert Clark", contact: "555-123-4567", source: "Phone", service: "Plumbing", status: "Contacted", date: "2023-05-01", notes: "Has leaking pipes in bathroom" },
  { id: "LEAD-503", name: "Susan Wright", contact: "susan@email.com", source: "Referral", service: "Electrical", status: "Qualified", date: "2023-05-02", notes: "Needs wiring for home office" },
  { id: "LEAD-504", name: "James Henderson", contact: "555-987-6543", source: "Social Media", service: "HVAC", status: "Proposal", date: "2023-05-02", notes: "Requesting quote for heat pump" },
  { id: "LEAD-505", name: "Patricia Young", contact: "patricia@email.com", source: "Website", service: "Plumbing", status: "New", date: "2023-05-03", notes: "Water heater issues" },
  { id: "LEAD-506", name: "Michael Turner", contact: "555-567-8901", source: "Email", service: "Electrical", status: "Contacted", date: "2023-05-03", notes: "Needs panel upgrade" },
  { id: "LEAD-507", name: "Elizabeth Baker", contact: "elizabeth@email.com", source: "Referral", service: "HVAC", status: "Qualified", date: "2023-05-04", notes: "Interested in ductless mini-split" },
  { id: "LEAD-508", name: "Thomas Nelson", contact: "555-234-5678", source: "Phone", service: "Plumbing", status: "Proposal", date: "2023-05-04", notes: "Complete bathroom remodel" }
];

// Detailed revenue data for dialog
export const detailedRevenueData = [
  { id: "TRX-101", date: "2023-05-01", client: "Reynolds Family", service: "AC Repair", amount: 780, status: "Paid", paymentMethod: "Credit Card" },
  { id: "TRX-102", date: "2023-05-01", client: "Garcia Home", service: "HVAC Installation", amount: 3400, status: "Paid", paymentMethod: "Check" },
  { id: "TRX-103", date: "2023-05-02", client: "Williams Apartment", service: "Appliance Repair", amount: 245, status: "Paid", paymentMethod: "Credit Card" },
  { id: "TRX-104", date: "2023-05-02", client: "Wilson Home", service: "Insulation", amount: 1870, status: "Paid", paymentMethod: "Bank Transfer" },
  { id: "TRX-105", date: "2023-05-03", client: "Smith Residence", service: "Electrical Repair", amount: 390, status: "Paid", paymentMethod: "Credit Card" },
  { id: "TRX-106", date: "2023-05-03", client: "Brown Family", service: "Duct Replacement", amount: 1250, status: "Pending", paymentMethod: "Invoice" },
  { id: "TRX-107", date: "2023-05-04", client: "Jones Building", service: "Commercial HVAC", amount: 5600, status: "Paid", paymentMethod: "Bank Transfer" },
  { id: "TRX-108", date: "2023-05-04", client: "Taylor Residence", service: "Plumbing Repair", amount: 475, status: "Pending", paymentMethod: "Invoice" },
  { id: "TRX-109", date: "2023-05-05", client: "Anderson Home", service: "Thermostat Installation", amount: 325, status: "Paid", paymentMethod: "Credit Card" },
  { id: "TRX-110", date: "2023-05-05", client: "Martinez Family", service: "Furnace Repair", amount: 850, status: "Paid", paymentMethod: "Check" }
];

// Detailed clients data for dialog
export const detailedClientsData = [
  { id: "CLT-201", name: "Reynolds Family", address: "123 Oak St", phone: "555-111-2222", email: "reynolds@email.com", jobs: 5, totalSpent: 4250, lastService: "2023-05-01" },
  { id: "CLT-202", name: "Martin Residence", address: "456 Pine Ave", phone: "555-222-3333", email: "martin@email.com", jobs: 3, totalSpent: 2100, lastService: "2023-05-02" },
  { id: "CLT-203", name: "Franklin Building", address: "789 Maple Rd", phone: "555-333-4444", email: "franklin@email.com", jobs: 7, totalSpent: 12500, lastService: "2023-05-03" },
  { id: "CLT-204", name: "Garcia Home", address: "321 Elm St", phone: "555-444-5555", email: "garcia@email.com", jobs: 2, totalSpent: 3900, lastService: "2023-05-01" },
  { id: "CLT-205", name: "Thompson Office", address: "654 Cedar Ln", phone: "555-555-6666", email: "thompson@email.com", jobs: 4, totalSpent: 7800, lastService: "2023-05-04" },
  { id: "CLT-206", name: "Johnson Residence", address: "987 Birch Blvd", phone: "555-666-7777", email: "johnson@email.com", jobs: 1, totalSpent: 1350, lastService: "2023-05-01" },
  { id: "CLT-207", name: "Williams Apartment", address: "159 Spruce Dr", phone: "555-777-8888", email: "williams@email.com", jobs: 2, totalSpent: 795, lastService: "2023-05-02" },
  { id: "CLT-208", name: "Davis Family", address: "753 Walnut Ct", phone: "555-888-9999", email: "davis@email.com", jobs: 6, totalSpent: 5250, lastService: "2023-05-03" }
];

// Detailed business metrics data for dialog
export const detailedBusinessMetrics = [
  { metric: "Average Job Value", value: "$3,542", change: "+7.2%", period: "vs. Last Month" },
  { metric: "Customer Satisfaction", value: "4.8/5", change: "+0.2", period: "vs. Last Month" },
  { metric: "Lead Conversion Rate", value: "68.5%", change: "+5.3%", period: "vs. Last Month" },
  { metric: "Average Response Time", value: "2.4 hours", change: "-0.5 hours", period: "vs. Last Month" },
  { metric: "Repeat Customer Rate", value: "72%", change: "+3%", period: "vs. Last Month" },
  { metric: "Technician Utilization", value: "85%", change: "+4%", period: "vs. Last Month" },
  { metric: "Average Job Duration", value: "3.2 hours", change: "-0.3 hours", period: "vs. Last Month" },
  { metric: "Profit Margin", value: "52%", change: "+2%", period: "vs. Last Month" }
];
