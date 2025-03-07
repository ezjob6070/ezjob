
import { v4 as uuidv4 } from 'uuid';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  source: string;
  value: number;
  dateAdded: Date;
  status: "active" | "converted" | "inactive";
  notes?: string;
};

export const initialLeads: Lead[] = [
  {
    id: uuidv4(),
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 90210",
    service: "Plumbing",
    source: "Website",
    value: 750,
    dateAdded: new Date("2023-05-15"),
    status: "active",
    notes: "Interested in bathroom remodel"
  },
  {
    id: uuidv4(),
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Springfield, CA 92831",
    service: "HVAC",
    source: "Referral",
    value: 1250,
    dateAdded: new Date("2023-06-02"),
    status: "active",
    notes: "Needs AC replacement before summer"
  },
  {
    id: uuidv4(),
    name: "Robert Williams",
    email: "rob.w@example.com",
    phone: "555-555-5555",
    address: "789 Pine St, Riverside, CA 92501",
    service: "Electrical",
    source: "Google Ads",
    value: 500,
    dateAdded: new Date("2023-06-10"),
    status: "converted",
    notes: "Converted after free quote"
  },
  {
    id: uuidv4(),
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    phone: "555-222-3333",
    address: "321 Elm St, Lakeside, CA 92040",
    service: "Plumbing",
    source: "Facebook",
    value: 350,
    dateAdded: new Date("2023-06-15"),
    status: "inactive",
    notes: "No response after initial consultation"
  },
  {
    id: uuidv4(),
    name: "Michael Davis",
    email: "mdavis@example.com",
    phone: "555-444-7777",
    address: "567 Maple Dr, Highland, CA 92346",
    service: "HVAC",
    source: "Website",
    value: 2000,
    dateAdded: new Date("2023-06-20"),
    status: "active",
    notes: "Interested in whole house HVAC upgrade"
  }
];
