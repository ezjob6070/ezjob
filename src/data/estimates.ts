
import { Estimate } from "@/types/estimate";
import { addDays } from "date-fns";

// Generate some fake estimates for demo purposes
const generateDemoEstimates = (): Estimate[] => {
  const today = new Date();
  
  return [
    {
      id: "est-001",
      clientName: "Riverside Development Corp",
      clientEmail: "contact@riverside-dev.example.com",
      clientPhone: "555-123-4567",
      status: "sent",
      projectTitle: "Downtown Office Complex",
      description: "15-story office building with underground parking",
      amount: 4850000,
      createdAt: addDays(today, -14),
      updatedAt: addDays(today, -10),
      expiresAt: addDays(today, 16),
      items: [
        { description: "Foundation and Structural Work", quantity: 1, unitPrice: 1250000 },
        { description: "Electrical Systems", quantity: 1, unitPrice: 875000 },
        { description: "Plumbing and HVAC", quantity: 1, unitPrice: 925000 },
        { description: "Interior Finishing", quantity: 1, unitPrice: 1100000 },
        { description: "Exterior and Landscaping", quantity: 1, unitPrice: 700000 }
      ]
    },
    {
      id: "est-002",
      clientName: "Greenfield Housing Association",
      clientEmail: "projects@greenfield.example.com",
      clientPhone: "555-987-6543",
      status: "in-process",
      projectTitle: "Parkview Residential Complex",
      description: "120-unit residential apartment complex with amenities",
      amount: 3250000,
      createdAt: addDays(today, -7),
      updatedAt: addDays(today, -5),
      expiresAt: addDays(today, 23),
      items: [
        { description: "Site Preparation", quantity: 1, unitPrice: 450000 },
        { description: "Building Construction (5 blocks)", quantity: 5, unitPrice: 450000 },
        { description: "Utilities and Infrastructure", quantity: 1, unitPrice: 625000 },
        { description: "Common Areas and Amenities", quantity: 1, unitPrice: 375000 }
      ]
    },
    {
      id: "est-003",
      clientName: "Bayshore Commercial Properties",
      clientEmail: "info@bayshore.example.com",
      clientPhone: "555-456-7890",
      status: "completed",
      projectTitle: "Waterfront Retail Center",
      description: "Shopping mall with 25 retail units and food court",
      amount: 2750000,
      createdAt: addDays(today, -30),
      updatedAt: addDays(today, -28),
      expiresAt: addDays(today, -15),
      items: [
        { description: "Core Structure", quantity: 1, unitPrice: 1250000 },
        { description: "Interior Build-out", quantity: 1, unitPrice: 850000 },
        { description: "Parking Area", quantity: 1, unitPrice: 350000 },
        { description: "Public Spaces and Landscaping", quantity: 1, unitPrice: 300000 }
      ]
    },
    {
      id: "est-004",
      clientName: "Mountain View School District",
      clientEmail: "facilities@mvsd.example.edu",
      clientPhone: "555-789-0123",
      status: "sent",
      projectTitle: "Elementary School Renovation",
      description: "Complete renovation of North Ridge Elementary School",
      amount: 1850000,
      createdAt: addDays(today, -5),
      updatedAt: addDays(today, -3),
      expiresAt: addDays(today, 25),
      items: [
        { description: "Structural Repairs", quantity: 1, unitPrice: 425000 },
        { description: "Classroom Modernization", quantity: 18, unitPrice: 45000 },
        { description: "Gymnasium Refurbishment", quantity: 1, unitPrice: 275000 },
        { description: "Cafeteria Expansion", quantity: 1, unitPrice: 320000 },
        { description: "Playground Equipment", quantity: 1, unitPrice: 155000 }
      ]
    },
    {
      id: "est-005",
      clientName: "Sunrise Healthcare Systems",
      clientEmail: "construction@sunrise-health.example.com",
      clientPhone: "555-345-6789",
      status: "in-process",
      projectTitle: "Medical Office Building",
      description: "Three-story medical office building with specialized facilities",
      amount: 3125000,
      createdAt: addDays(today, -10),
      updatedAt: addDays(today, -8),
      expiresAt: addDays(today, 20),
      items: [
        { description: "Core and Shell Construction", quantity: 1, unitPrice: 1350000 },
        { description: "Medical Equipment Installation", quantity: 1, unitPrice: 875000 },
        { description: "Specialized Rooms (Operating, Imaging)", quantity: 1, unitPrice: 650000 },
        { description: "Office Spaces", quantity: 15, unitPrice: 16000 }
      ]
    },
    {
      id: "est-006",
      clientName: "Harbor Industrial Partners",
      clientEmail: "development@hip.example.com",
      clientPhone: "555-234-5678",
      status: "completed",
      projectTitle: "Warehouse Distribution Center",
      description: "150,000 sq ft distribution center with loading bays",
      amount: 2250000,
      createdAt: addDays(today, -45),
      updatedAt: addDays(today, -42),
      expiresAt: addDays(today, -25),
      items: [
        { description: "Foundation and Structure", quantity: 1, unitPrice: 950000 },
        { description: "Roofing Systems", quantity: 1, unitPrice: 375000 },
        { description: "Loading Dock Areas", quantity: 12, unitPrice: 45000 },
        { description: "Office Area Build-out", quantity: 1, unitPrice: 320000 },
        { description: "Paving and Site Work", quantity: 1, unitPrice: 290000 }
      ]
    }
  ];
};

export const initialEstimates: Estimate[] = generateDemoEstimates();
