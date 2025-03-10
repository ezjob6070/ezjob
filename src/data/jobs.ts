
import { v4 as uuidv4 } from 'uuid';
import { Job } from '@/components/jobs/JobTypes';

export const initialJobs: Job[] = [
  {
    id: uuidv4(),
    clientName: "John Smith",
    title: "Bathroom Plumbing Repair",
    status: "scheduled",
    date: new Date("2023-07-15"),
    technicianName: "Michael Brown",
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
    technicianName: "Jennifer Taylor",
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
    technicianName: "Michael Brown",
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
  },
  {
    id: uuidv4(),
    clientName: "Jennifer Lee",
    title: "Water Heater Replacement",
    status: "completed",
    date: new Date("2023-06-28"),
    technicianName: "Michael Brown",
    address: "890 Cedar Lane, Riverside, CA 92503",
    amount: 1200,
    paymentMethod: "credit_card",
    description: "Replace old water heater with new energy-efficient model",
    notes: ""
  },
  {
    id: uuidv4(),
    clientName: "Thomas Anderson",
    title: "Garbage Disposal Installation",
    status: "cancelled",
    date: new Date("2023-07-08"),
    technicianName: "Michael Brown",
    address: "432 Birch St, San Bernardino, CA 92410",
    amount: 325,
    paymentMethod: "credit_card",
    description: "Install new garbage disposal unit in kitchen sink",
    notes: "Customer cancelled due to emergency"
  },
  {
    id: uuidv4(),
    clientName: "David Martinez",
    title: "Ceiling Fan Installation",
    status: "completed",
    date: new Date("2023-06-15"),
    technicianName: "Jennifer Taylor",
    address: "765 Willow Ave, Corona, CA 92879",
    amount: 275,
    paymentMethod: "zelle",
    description: "Install ceiling fan in master bedroom",
    notes: ""
  },
  {
    id: uuidv4(),
    clientName: "Emily Wilson",
    title: "Electrical Troubleshooting",
    status: "cancelled",
    date: new Date("2023-07-20"),
    technicianName: "Jennifer Taylor",
    address: "345 Redwood Dr, Moreno Valley, CA 92553",
    amount: 150,
    paymentMethod: "cash",
    description: "Diagnose and fix flickering lights in living room",
    notes: "Cancelled - customer found another service"
  },
  {
    id: uuidv4(),
    clientName: "Richard Thompson",
    title: "Smart Thermostat Installation",
    status: "completed",
    date: new Date("2023-07-02"),
    technicianName: "David Wilson",
    address: "123 Peach St, Redlands, CA 92374",
    amount: 225,
    paymentMethod: "credit_card",
    description: "Install and program new smart thermostat system",
    notes: "Customer has Nest account already"
  }
];
