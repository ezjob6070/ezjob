
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

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

// Generate demo lead data
const generateDemoLeads = (): Lead[] => {
  const today = new Date();
  
  return [
    {
      id: uuidv4(),
      name: "Robert Chen",
      email: "robert.chen@example.com",
      phone: "555-123-4567",
      address: "123 Main Street, Anytown, ST 12345",
      service: "HVAC Installation",
      source: "Website",
      value: 12500,
      dateAdded: subDays(today, 2),
      status: "active",
      notes: "Interested in new HVAC system for office building. Requested quote for installation next month."
    },
    {
      id: uuidv4(),
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "555-987-6543",
      address: "456 Oak Avenue, Sometown, ST 23456",
      service: "Plumbing Services",
      source: "Referral",
      value: 3800,
      dateAdded: subDays(today, 5),
      status: "active",
      notes: "Referred by John Smith. Needs complete bathroom renovation with new plumbing."
    },
    {
      id: uuidv4(),
      name: "David Wilson",
      email: "david.w@example.com",
      phone: "555-567-8901",
      address: "789 Pine Road, Othertown, ST 34567",
      service: "Electrical Renovation",
      source: "Google Ads",
      value: 8200,
      dateAdded: subDays(today, 8),
      status: "converted",
      notes: "Commercial rewiring project for retail store. Quote approved, scheduled for next week."
    },
    {
      id: uuidv4(),
      name: "Jennifer Baker",
      email: "j.baker@example.com",
      phone: "555-234-5678",
      address: "101 Maple Drive, Newtown, ST 45678",
      service: "Roofing",
      source: "Social Media",
      value: 15800,
      dateAdded: subDays(today, 12),
      status: "active",
      notes: "Roof replacement needed after storm damage. Insurance claim in process."
    },
    {
      id: uuidv4(),
      name: "Michael Thomas",
      email: "m.thomas@example.com",
      phone: "555-345-6789",
      address: "202 Cedar Lane, Oldtown, ST 56789",
      service: "Kitchen Remodel",
      source: "Home Show",
      value: 25000,
      dateAdded: subDays(today, 15),
      status: "active",
      notes: "Complete kitchen renovation including appliances. Ready to start in 30 days."
    },
    {
      id: uuidv4(),
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "555-456-7890",
      address: "303 Birch Street, Downtown, ST 67890",
      service: "Solar Installation",
      source: "Referral",
      value: 32000,
      dateAdded: subDays(today, 20),
      status: "converted",
      notes: "Residential solar panel installation. Contract signed, permits in process."
    },
    {
      id: uuidv4(),
      name: "James Miller",
      email: "james.m@example.com",
      phone: "555-567-8901",
      address: "404 Walnut Court, Uptown, ST 78901",
      service: "Basement Finishing",
      source: "Website",
      value: 18500,
      dateAdded: subDays(today, 22),
      status: "inactive",
      notes: "No response after initial consultation. Follow up in 30 days."
    },
    {
      id: uuidv4(),
      name: "Patricia Brown",
      email: "p.brown@example.com",
      phone: "555-678-9012",
      address: "505 Elm Place, Midtown, ST 89012",
      service: "Window Replacement",
      source: "Direct Mail",
      value: 9600,
      dateAdded: subDays(today, 25),
      status: "active",
      notes: "Needs energy-efficient windows throughout home. Comparing quotes from competitors."
    },
    {
      id: uuidv4(),
      name: "Christopher Lee",
      email: "c.lee@example.com",
      phone: "555-789-0123",
      address: "606 Spruce Way, Westside, ST 90123",
      service: "Commercial HVAC",
      source: "Trade Show",
      value: 45000,
      dateAdded: subDays(today, 30),
      status: "converted",
      notes: "Office building HVAC upgrade. First phase scheduled to begin next month."
    },
    {
      id: uuidv4(),
      name: "Elizabeth Taylor",
      email: "e.taylor@example.com",
      phone: "555-890-1234",
      address: "707 Aspen Road, Eastside, ST 01234",
      service: "Bathroom Remodel",
      source: "Newspaper Ad",
      value: 12700,
      dateAdded: subDays(today, 35),
      status: "active",
      notes: "Master bathroom renovation. Site visit completed, awaiting final design approval."
    }
  ];
};

export const initialLeads: Lead[] = generateDemoLeads();
