import { Task } from "../types";
import { addDays, addHours, format, startOfDay, subDays } from "date-fns";

// Helper to generate dates relative to today
const today = new Date();
const todayStart = startOfDay(today);

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "HVAC Installation",
    start: addHours(todayStart, 9).toISOString(),
    end: addHours(todayStart, 12).toISOString(),
    allDay: false,
    description: "Install new HVAC system at City Center Tower",
    location: "Downtown Financial District",
    client: { name: "Metropolitan Development Corp" },
    technician: "John Smith",
    status: "scheduled",
    color: "#3b82f6", // blue
    type: "installation",
    priority: "medium",
    dueDate: addHours(todayStart, 12),
    hasFollowUp: false
  },
  {
    id: "task-2",
    title: "Electrical Inspection",
    start: addHours(todayStart, 14).toISOString(),
    end: addHours(todayStart, 16).toISOString(),
    allDay: false,
    description: "Perform electrical safety inspection for office building",
    location: "North Innovation District",
    client: { name: "TechFuture Investments" },
    technician: "Sarah Johnson",
    status: "in progress",
    color: "#10b981", // green
    type: "inspection",
    priority: "high",
    dueDate: addHours(todayStart, 16),
    hasFollowUp: true,
    followUpDate: addDays(todayStart, 7)
  },
  {
    id: "task-3",
    title: "Plumbing Repair",
    start: addDays(addHours(todayStart, 10), 1).toISOString(),
    end: addDays(addHours(todayStart, 13), 1).toISOString(),
    allDay: false,
    description: "Fix water leak in hotel basement",
    location: "Harbor District",
    client: { name: "Global Hospitality Group" },
    technician: "Michael Rodriguez",
    status: "overdue",
    color: "#f59e0b", // amber
    type: "repair",
    priority: "urgent",
    dueDate: addDays(addHours(todayStart, 13), 1),
    hasFollowUp: false
  },
  {
    id: "task-3-followup",
    title: "Follow-up: Plumbing Repair Verification",
    start: addDays(addHours(todayStart, 10), 2).toISOString(),
    end: addDays(addHours(todayStart, 12), 2).toISOString(),
    allDay: false,
    description: "Verify repair fixed the leak in hotel basement",
    location: "Harbor District",
    client: { name: "Global Hospitality Group" },
    technician: "Michael Rodriguez",
    status: "scheduled",
    color: "#4f46e5", // indigo
    type: "follow-up",
    priority: "high",
    dueDate: addDays(addHours(todayStart, 12), 2),
    hasFollowUp: false,
    parentTaskId: "task-3"
  },
  {
    id: "task-4",
    title: "Furniture Installation",
    start: addDays(addHours(todayStart, 9), 1).toISOString(),
    end: addDays(addHours(todayStart, 17), 1).toISOString(),
    allDay: true,
    description: "Install custom woodworking for community center",
    location: "Cedar Grove Neighborhood",
    client: { name: "City of Cedar Grove" },
    technician: "Jennifer Lopez",
    status: "scheduled",
    color: "#8b5cf6", // purple
    type: "installation",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 17), 1)
  },
  {
    id: "task-5",
    title: "Foundation Inspection",
    start: addDays(addHours(todayStart, 13), 2).toISOString(),
    end: addDays(addHours(todayStart, 15), 2).toISOString(),
    allDay: false,
    description: "Check foundation work at industrial park",
    location: "Eastern Industrial Zone",
    client: { name: "Summit Logistics Corp" },
    technician: "David Washington",
    status: "scheduled",
    color: "#ef4444", // red
    type: "inspection",
    priority: "high",
    dueDate: addDays(addHours(todayStart, 15), 2)
  },
  {
    id: "task-6",
    title: "Equipment Delivery",
    start: addDays(addHours(todayStart, 8), 2).toISOString(),
    end: addDays(addHours(todayStart, 10), 2).toISOString(),
    allDay: false,
    description: "Deliver heavy machinery to medical center site",
    location: "Parkside District",
    client: { name: "Regional Healthcare Systems" },
    technician: "Robert Garcia",
    status: "scheduled",
    color: "#0ea5e9", // sky blue
    type: "delivery",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 10), 2)
  },
  {
    id: "task-7",
    title: "Interior Painting",
    start: addDays(addHours(todayStart, 9), 3).toISOString(),
    end: addDays(addHours(todayStart, 17), 3).toISOString(),
    allDay: true,
    description: "Complete interior painting at retail expansion",
    location: "West Commercial District",
    client: { name: "Westview Retail Properties" },
    technician: "Emily Chen",
    status: "scheduled",
    color: "#ec4899", // pink
    type: "finishing",
    priority: "low",
    dueDate: addDays(addHours(todayStart, 17), 3)
  },
  {
    id: "task-8",
    title: "Roof Repair",
    start: addDays(addHours(todayStart, 11), 3).toISOString(),
    end: addDays(addHours(todayStart, 16), 3).toISOString(),
    allDay: false,
    description: "Fix roof leak at residential complex",
    location: "Riverside South",
    client: { name: "Riverfront Properties LLC" },
    technician: "William Taylor",
    status: "scheduled",
    color: "#f59e0b", // amber
    type: "repair",
    priority: "high",
    dueDate: addDays(addHours(todayStart, 16), 3)
  },
  {
    id: "task-9",
    title: "HVAC Maintenance",
    start: addDays(addHours(todayStart, 14), 4).toISOString(),
    end: addDays(addHours(todayStart, 17), 4).toISOString(),
    allDay: false,
    description: "Quarterly HVAC system maintenance",
    location: "Central Metro District",
    client: { name: "Metropolitan Transit Authority" },
    technician: "Olivia Martinez",
    status: "scheduled",
    color: "#3b82f6", // blue
    type: "maintenance",
    priority: "low",
    dueDate: addDays(addHours(todayStart, 17), 4)
  },
  {
    id: "task-10",
    title: "Flooring Installation",
    start: addDays(addHours(todayStart, 9), 4).toISOString(),
    end: addDays(addHours(todayStart, 17), 4).toISOString(),
    allDay: true,
    description: "Install marble flooring in hotel lobby",
    location: "Harbor District",
    client: { name: "Global Hospitality Group" },
    technician: "James Wilson",
    status: "scheduled",
    color: "#8b5cf6", // purple
    type: "installation",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 17), 4)
  },
  // Additional tasks for better calendar visualization
  {
    id: "task-11",
    title: "Emergency Elevator Repair",
    start: addHours(todayStart, 11).toISOString(),
    end: addHours(todayStart, 14).toISOString(),
    allDay: false,
    description: "Fix broken elevator in office building",
    location: "Downtown Business Center",
    client: { name: "Prime Property Management" },
    technician: "Alex Johnson",
    status: "scheduled",
    color: "#ef4444", // red
    type: "emergency",
    priority: "urgent",
    dueDate: addHours(todayStart, 14)
  },
  {
    id: "task-12",
    title: "Lighting Installation",
    start: subDays(addHours(todayStart, 13), 1).toISOString(),
    end: subDays(addHours(todayStart, 17), 1).toISOString(),
    allDay: false,
    description: "Install decorative lighting in restaurant",
    location: "Riverside Dining District",
    client: { name: "Gourmet Ventures Inc" },
    technician: "Maria Garcia",
    status: "completed",
    color: "#10b981", // green
    type: "installation",
    priority: "medium",
    dueDate: subDays(addHours(todayStart, 17), 1)
  },
  {
    id: "task-13",
    title: "Security System Maintenance",
    start: addDays(addHours(todayStart, 9), 2).toISOString(),
    end: addDays(addHours(todayStart, 12), 2).toISOString(),
    allDay: false,
    description: "Quarterly security system check",
    location: "Financial District",
    client: { name: "First National Bank" },
    technician: "David Chen",
    status: "scheduled",
    color: "#3b82f6", // blue
    type: "maintenance",
    priority: "high",
    dueDate: addDays(addHours(todayStart, 12), 2)
  },
  {
    id: "task-14",
    title: "Restaurant Equipment Installation",
    start: addDays(addHours(todayStart, 7), 3).toISOString(),
    end: addDays(addHours(todayStart, 16), 3).toISOString(),
    allDay: true,
    description: "Install new kitchen equipment in restaurant",
    location: "Downtown Culinary District",
    client: { name: "Fine Dining Group" },
    technician: "Thomas Wright",
    status: "scheduled",
    color: "#8b5cf6", // purple
    type: "installation",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 16), 3)
  },
  {
    id: "task-15",
    title: "Water Damage Assessment",
    start: subDays(addHours(todayStart, 10), 2).toISOString(),
    end: subDays(addHours(todayStart, 12), 2).toISOString(),
    allDay: false,
    description: "Assess water damage in apartment building",
    location: "Lakeside Residences",
    client: { name: "Urban Housing Authority" },
    technician: "Sarah Peterson",
    status: "completed",
    color: "#ef4444", // red
    type: "inspection",
    priority: "urgent",
    dueDate: subDays(addHours(todayStart, 12), 2)
  },
  {
    id: "task-16",
    title: "Network Cabling",
    start: addDays(addHours(todayStart, 8), 5).toISOString(),
    end: addDays(addHours(todayStart, 17), 5).toISOString(),
    allDay: true,
    description: "Install network cabling in new office space",
    location: "Tech Park",
    client: { name: "Innovate Tech Solutions" },
    technician: "Michael Lee",
    status: "scheduled",
    color: "#0ea5e9", // sky blue
    type: "installation",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 17), 5)
  },
  {
    id: "task-17",
    title: "Plumbing Inspection",
    start: addDays(addHours(todayStart, 13), 6).toISOString(),
    end: addDays(addHours(todayStart, 15), 6).toISOString(),
    allDay: false,
    description: "Annual plumbing inspection for hotel",
    location: "Harborview Hotel",
    client: { name: "Luxury Accommodations Inc" },
    technician: "Robert Taylor",
    status: "scheduled",
    color: "#10b981", // green
    type: "inspection",
    priority: "low",
    dueDate: addDays(addHours(todayStart, 15), 6)
  },
  {
    id: "task-18",
    title: "Wireless Access Point Installation",
    start: addDays(addHours(todayStart, 9), 7).toISOString(),
    end: addDays(addHours(todayStart, 18), 7).toISOString(),
    allDay: true,
    description: "Install WiFi access points across campus",
    location: "Westside University",
    client: { name: "Education Technology Department" },
    technician: "Jennifer Adams",
    status: "scheduled",
    color: "#3b82f6", // blue
    type: "installation",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 18), 7)
  },
  {
    id: "task-19",
    title: "Fire Alarm Testing",
    start: addDays(addHours(todayStart, 8), 8).toISOString(),
    end: addDays(addHours(todayStart, 10), 8).toISOString(),
    allDay: false,
    description: "Quarterly fire alarm system testing",
    location: "Central Office Tower",
    client: { name: "Corporate Plaza Management" },
    technician: "Kevin Martinez",
    status: "scheduled",
    color: "#ef4444", // red
    type: "testing",
    priority: "high",
    dueDate: addDays(addHours(todayStart, 10), 8)
  },
  {
    id: "task-20",
    title: "Gym Equipment Maintenance",
    start: addDays(addHours(todayStart, 14), 9).toISOString(),
    end: addDays(addHours(todayStart, 18), 9).toISOString(),
    allDay: false,
    description: "Regular maintenance of fitness equipment",
    location: "Downtown Fitness Center",
    client: { name: "Urban Wellness Group" },
    technician: "Michelle Jackson",
    status: "scheduled",
    color: "#10b981", // green
    type: "maintenance",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 18), 9)
  },
  {
    id: "task-21",
    title: "Client Follow-up Call",
    start: addHours(todayStart, 13).toISOString(),
    end: addHours(todayStart, 14).toISOString(),
    allDay: false,
    description: "Call client to discuss recent installation and address any concerns",
    location: "Office",
    client: { name: "Northern Medical Center" },
    technician: "David Garcia",
    status: "scheduled",
    color: "#8b5cf6", // purple
    type: "follow-up",
    priority: "medium",
    dueDate: addHours(todayStart, 14),
    hasFollowUp: false
  },
  {
    id: "task-22",
    title: "Equipment Calibration",
    start: addHours(todayStart, 15).toISOString(),
    end: addHours(todayStart, 17).toISOString(),
    allDay: false,
    description: "Calibrate sensitive medical equipment for the new wing",
    location: "Eastside Hospital",
    client: { name: "Eastside Healthcare Systems" },
    technician: "Jennifer Lopez",
    status: "scheduled",
    color: "#059669", // emerald
    type: "maintenance",
    priority: "high",
    dueDate: addHours(todayStart, 17),
    hasFollowUp: false
  },
  {
    id: "task-23",
    title: "Monthly System Audit",
    start: addDays(todayStart, 1).toISOString(),
    end: addDays(addHours(todayStart, 4), 1).toISOString(),
    allDay: false,
    description: "Perform comprehensive security system audit for corporate headquarters",
    location: "Financial District",
    client: { name: "Global Investments Corp" },
    technician: "Michael Rodriguez",
    status: "scheduled",
    color: "#0ea5e9", // sky blue
    type: "audit",
    priority: "medium",
    dueDate: addDays(addHours(todayStart, 4), 1),
    hasFollowUp: false
  },
  {
    id: "task-24",
    title: "Follow-up Training Session",
    start: addDays(addHours(todayStart, 10), 2).toISOString(),
    end: addDays(addHours(todayStart, 14), 2).toISOString(),
    allDay: false,
    description: "Conduct training session for staff on new security protocols",
    location: "West Tower, Training Room B",
    client: { name: "Secure Financial Partners" },
    technician: "Sarah Johnson",
    status: "scheduled",
    color: "#4f46e5", // indigo
    type: "training",
    priority: "low",
    dueDate: addDays(addHours(todayStart, 14), 2),
    hasFollowUp: true,
    followUpDate: addDays(todayStart, 9)
  },
  {
    id: "task-24-followup",
    title: "Training Effectiveness Assessment",
    start: addDays(addHours(todayStart, 10), 9).toISOString(),
    end: addDays(addHours(todayStart, 12), 9).toISOString(),
    allDay: false,
    description: "Assess effectiveness of the security protocol training",
    location: "West Tower",
    client: { name: "Secure Financial Partners" },
    technician: "Sarah Johnson",
    status: "scheduled",
    color: "#4f46e5", // indigo
    type: "follow-up",
    priority: "low",
    dueDate: addDays(addHours(todayStart, 12), 9),
    hasFollowUp: false,
    parentTaskId: "task-24"
  },
  {
    id: "task-25",
    title: "Emergency Generator Testing",
    start: addDays(addHours(todayStart, 8), 3).toISOString(),
    end: addDays(addHours(todayStart, 11), 3).toISOString(),
    allDay: false,
    description: "Test emergency generator systems at data center",
    location: "North Data Center",
    client: { name: "CloudTech Solutions" },
    technician: "Robert Taylor",
    status: "scheduled",
    color: "#dc2626", // red
    type: "testing",
    priority: "high",
    dueDate: addDays(addHours(todayStart, 11), 3),
    hasFollowUp: false
  }
];
