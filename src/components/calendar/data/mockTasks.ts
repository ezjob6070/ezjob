
import { Task } from "../types";
import { addDays, addHours, format, startOfDay } from "date-fns";

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
    client: "Metropolitan Development Corp",
    technician: "John Smith",
    status: "scheduled",
    color: "#3b82f6", // blue
    type: "installation"
  },
  {
    id: "task-2",
    title: "Electrical Inspection",
    start: addHours(todayStart, 14).toISOString(),
    end: addHours(todayStart, 16).toISOString(),
    allDay: false,
    description: "Perform electrical safety inspection for office building",
    location: "North Innovation District",
    client: "TechFuture Investments",
    technician: "Sarah Johnson",
    status: "scheduled",
    color: "#10b981", // green
    type: "inspection"
  },
  {
    id: "task-3",
    title: "Plumbing Repair",
    start: addDays(addHours(todayStart, 10), 1).toISOString(),
    end: addDays(addHours(todayStart, 13), 1).toISOString(),
    allDay: false,
    description: "Fix water leak in hotel basement",
    location: "Harbor District",
    client: "Global Hospitality Group",
    technician: "Michael Rodriguez",
    status: "scheduled",
    color: "#f59e0b", // amber
    type: "repair"
  },
  {
    id: "task-4",
    title: "Furniture Installation",
    start: addDays(addHours(todayStart, 9), 1).toISOString(),
    end: addDays(addHours(todayStart, 17), 1).toISOString(),
    allDay: true,
    description: "Install custom woodworking for community center",
    location: "Cedar Grove Neighborhood",
    client: "City of Cedar Grove",
    technician: "Jennifer Lopez",
    status: "scheduled",
    color: "#8b5cf6", // purple
    type: "installation"
  },
  {
    id: "task-5",
    title: "Foundation Inspection",
    start: addDays(addHours(todayStart, 13), 2).toISOString(),
    end: addDays(addHours(todayStart, 15), 2).toISOString(),
    allDay: false,
    description: "Check foundation work at industrial park",
    location: "Eastern Industrial Zone",
    client: "Summit Logistics Corp",
    technician: "David Washington",
    status: "scheduled",
    color: "#ef4444", // red
    type: "inspection"
  },
  {
    id: "task-6",
    title: "Equipment Delivery",
    start: addDays(addHours(todayStart, 8), 2).toISOString(),
    end: addDays(addHours(todayStart, 10), 2).toISOString(),
    allDay: false,
    description: "Deliver heavy machinery to medical center site",
    location: "Parkside District",
    client: "Regional Healthcare Systems",
    technician: "Robert Garcia",
    status: "scheduled",
    color: "#0ea5e9", // sky blue
    type: "delivery"
  },
  {
    id: "task-7",
    title: "Interior Painting",
    start: addDays(addHours(todayStart, 9), 3).toISOString(),
    end: addDays(addHours(todayStart, 17), 3).toISOString(),
    allDay: true,
    description: "Complete interior painting at retail expansion",
    location: "West Commercial District",
    client: "Westview Retail Properties",
    technician: "Emily Chen",
    status: "scheduled",
    color: "#ec4899", // pink
    type: "finishing"
  },
  {
    id: "task-8",
    title: "Roof Repair",
    start: addDays(addHours(todayStart, 11), 3).toISOString(),
    end: addDays(addHours(todayStart, 16), 3).toISOString(),
    allDay: false,
    description: "Fix roof leak at residential complex",
    location: "Riverside South",
    client: "Riverfront Properties LLC",
    technician: "William Taylor",
    status: "scheduled",
    color: "#f59e0b", // amber
    type: "repair"
  },
  {
    id: "task-9",
    title: "HVAC Maintenance",
    start: addDays(addHours(todayStart, 14), 4).toISOString(),
    end: addDays(addHours(todayStart, 17), 4).toISOString(),
    allDay: false,
    description: "Quarterly HVAC system maintenance",
    location: "Central Metro District",
    client: "Metropolitan Transit Authority",
    technician: "Olivia Martinez",
    status: "scheduled",
    color: "#3b82f6", // blue
    type: "maintenance"
  },
  {
    id: "task-10",
    title: "Flooring Installation",
    start: addDays(addHours(todayStart, 9), 4).toISOString(),
    end: addDays(addHours(todayStart, 17), 4).toISOString(),
    allDay: true,
    description: "Install marble flooring in hotel lobby",
    location: "Harbor District",
    client: "Global Hospitality Group",
    technician: "James Wilson",
    status: "scheduled",
    color: "#8b5cf6", // purple
    type: "installation"
  }
];
