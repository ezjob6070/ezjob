
import { v4 as uuidv4 } from 'uuid';
import { Job } from '@/components/jobs/JobTypes';

export const initialJobs: Job[] = [
  {
    id: uuidv4(),
    clientName: "John Smith",
    title: "Bathroom Plumbing Repair",
    status: "scheduled",
    date: new Date("2023-07-15"),
    technicianName: "Mike Johnson",
    address: "123 Main St, Anytown, CA 90210",
    amount: 450,
    paymentMethod: "credit_card",
    description: "Fix leaking pipe under sink and replace bathroom faucet",
    notes: "Customer prefers afternoon appointment"
  },
  {
    id: uuidv4(),
    clientName: "Sarah Johnson",
    title: "AC Maintenance",
    status: "completed",
    date: new Date("2023-07-10"),
    technicianName: "David Wilson",
    address: "456 Oak Ave, Springfield, CA 92831",
    amount: 250,
    paymentMethod: "check",
    description: "Annual AC system maintenance and filter replacement",
    notes: "Customer is a VIP, extra attention to detail"
  },
  {
    id: uuidv4(),
    clientName: "Robert Williams",
    title: "Electrical Panel Upgrade",
    status: "in_progress",
    date: new Date("2023-07-12"),
    technicianName: "Tom Garcia",
    address: "789 Pine St, Riverside, CA 92501",
    amount: 1750,
    paymentMethod: "zelle",
    description: "Upgrade electrical panel from 100A to 200A service",
    notes: "Need to coordinate with utility company for shutdown"
  },
  {
    id: uuidv4(),
    clientName: "Lisa Brown",
    title: "Drain Cleaning",
    status: "completed",
    date: new Date("2023-07-05"),
    technicianName: "Mike Johnson",
    address: "321 Elm St, Lakeside, CA 92040",
    amount: 175,
    paymentMethod: "cash",
    description: "Clear clogged kitchen sink drain",
    notes: ""
  },
  {
    id: uuidv4(),
    clientName: "Michael Davis",
    title: "New HVAC Installation",
    status: "scheduled",
    date: new Date("2023-07-25"),
    technicianName: "David Wilson",
    address: "567 Maple Dr, Highland, CA 92346",
    amount: 5250,
    paymentMethod: "credit_card",
    description: "Install new high-efficiency HVAC system",
    notes: "Customer requested no-contact service"
  }
];
