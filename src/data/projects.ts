import { Project } from "@/types/project";

export const initialProjects: Project[] = [
  {
    id: 1,
    name: "City Center Tower",
    type: "Commercial Building",
    description: "42-story office and retail complex in downtown area with LEED certification and smart building technology integration. Features include underground parking for 500 vehicles, 15 high-speed elevators, and 30,000 sq ft of retail space.",
    location: "Downtown Financial District",
    completion: 65,
    workers: 145,
    vehicles: 28,
    status: "In Progress",
    startDate: "2023-02-15",
    expectedEndDate: "2024-11-30",
    budget: 42500000,
    actualSpent: 27625000,
    clientName: "Metropolitan Development Corp",
    contractors: [
      {
        id: "cont-001",
        name: "Martha Rodriguez",
        role: "Lead Architect",
        rate: 150,
        rateType: "hourly",
        hoursWorked: 450,
        totalPaid: 67500,
        startDate: "2023-02-01",
        status: "active",
        email: "martha.r@architects.com"
      },
      {
        id: "cont-002",
        name: "James Wilson",
        role: "Electrical Engineer",
        rate: 120,
        rateType: "hourly",
        hoursWorked: 380,
        totalPaid: 45600,
        startDate: "2023-02-10",
        status: "active",
        email: "jwilson@engineers.com"
      }
    ],
    salesmen: [
      {
        id: "sale-001",
        name: "Robert Thompson",
        commission: 2.5,
        commissionType: "percentage",
        totalSales: 42500000,
        totalCommission: 1062500,
        email: "robert@metrodev.com",
        phone: "555-123-4567"
      }
    ]
  },
  {
    id: 2,
    name: "Riverside Residential",
    type: "Residential Complex",
    description: "350-unit luxury apartment complex with amenities including infinity pool, fitness center, co-working spaces, and rooftop gardens. Sustainable design with solar panels and rainwater harvesting systems.",
    location: "Riverside South",
    completion: 82,
    workers: 98,
    vehicles: 15,
    status: "In Progress",
    startDate: "2023-01-10",
    expectedEndDate: "2024-05-30",
    budget: 28750000,
    actualSpent: 24437500,
    clientName: "Riverfront Properties LLC",
    contractors: [
      {
        id: "cont-003",
        name: "Sarah Chen",
        role: "Project Manager",
        rate: 140,
        rateType: "hourly",
        hoursWorked: 720,
        totalPaid: 100800,
        startDate: "2022-12-15",
        status: "active",
        email: "schen@construction.com"
      }
    ],
    salesmen: [
      {
        id: "sale-002",
        name: "Diana Palmer",
        commission: 1.75,
        commissionType: "percentage",
        totalSales: 28750000,
        totalCommission: 503125,
        email: "diana@riverprops.com",
        phone: "555-234-5678"
      }
    ]
  },
  {
    id: 3,
    name: "Tech Park Campus",
    type: "Tech Office Campus",
    description: "5-building technology campus with sustainable design, green roofs, and collaborative innovation spaces. Campus includes outdoor amphitheater, three cafeterias, and autonomous vehicle testing area.",
    location: "North Innovation District",
    completion: 35,
    workers: 175,
    vehicles: 32,
    status: "In Progress",
    startDate: "2023-05-20",
    expectedEndDate: "2025-03-15",
    budget: 56000000,
    actualSpent: 19600000,
    clientName: "TechFuture Investments",
    contractors: [
      {
        id: "cont-004",
        name: "Daniel Park",
        role: "Sustainability Consultant",
        rate: 160,
        rateType: "hourly",
        hoursWorked: 310,
        totalPaid: 49600,
        startDate: "2023-05-01",
        status: "active",
        email: "dpark@greenbuild.com"
      },
      {
        id: "cont-005",
        name: "James Wilson",
        role: "Electrical Systems",
        rate: 120,
        rateType: "hourly",
        hoursWorked: 250,
        totalPaid: 30000,
        startDate: "2023-06-15",
        status: "active",
        email: "jwilson@engineers.com"
      }
    ],
    salesmen: [
      {
        id: "sale-003",
        name: "Michael Chang",
        commission: 2.0,
        commissionType: "percentage",
        totalSales: 56000000,
        totalCommission: 1120000,
        email: "mchang@techfuture.com",
        phone: "555-345-6789"
      }
    ]
  },
  {
    id: 4,
    name: "Harbor View Hotel",
    type: "Hospitality",
    description: "250-room luxury hotel with conference facilities, three restaurants, spa, and rooftop infinity pool overlooking the harbor. Features smart room technology and sustainable waste management systems.",
    location: "Harbor District",
    completion: 90,
    workers: 68,
    vehicles: 12,
    status: "In Progress",
    startDate: "2022-11-05",
    expectedEndDate: "2024-01-30",
    budget: 31250000,
    actualSpent: 29687500,
    clientName: "Global Hospitality Group",
    contractors: [
      {
        id: "cont-006",
        name: "Elena Martinez",
        role: "Interior Designer",
        rate: 130,
        rateType: "hourly",
        hoursWorked: 680,
        totalPaid: 88400,
        startDate: "2022-12-01",
        status: "active",
        email: "elena@designstudio.com"
      }
    ],
    salesmen: [
      {
        id: "sale-004",
        name: "Robert Thompson",
        commission: 1.5,
        commissionType: "percentage",
        totalSales: 31250000,
        totalCommission: 468750,
        email: "robert@metrodev.com",
        phone: "555-123-4567"
      }
    ]
  },
  {
    id: 5,
    name: "Summit Industrial Park",
    type: "Industrial",
    description: "Manufacturing and distribution complex with 5 buildings totaling 750,000 sq ft. Features include advanced logistics systems, automated warehouse capabilities, and dedicated truck staging areas.",
    location: "Eastern Industrial Zone",
    completion: 45,
    workers: 112,
    vehicles: 24,
    status: "In Progress",
    startDate: "2023-04-12",
    expectedEndDate: "2024-09-30",
    budget: 24500000,
    actualSpent: 11025000,
    clientName: "Summit Logistics Corp",
    contractors: [
      {
        id: "cont-007",
        name: "Thomas Wright",
        role: "Logistics Specialist",
        rate: 125,
        rateType: "hourly",
        hoursWorked: 420,
        totalPaid: 52500,
        startDate: "2023-04-01",
        status: "active",
        email: "twright@logistics.com"
      }
    ],
    salesmen: [
      {
        id: "sale-005",
        name: "Jennifer Adams",
        commission: 2.25,
        commissionType: "percentage",
        totalSales: 24500000,
        totalCommission: 551250,
        email: "jadams@summit.com",
        phone: "555-456-7890"
      }
    ]
  },
  {
    id: 6,
    name: "Cedar Grove Community Center",
    type: "Public/Community",
    description: "Multi-purpose community center with recreation facilities, library, senior center, and public meeting spaces. Designed for accessibility and includes geothermal heating/cooling systems.",
    location: "Cedar Grove Neighborhood",
    completion: 75,
    workers: 58,
    vehicles: 8,
    status: "In Progress",
    startDate: "2023-03-01",
    expectedEndDate: "2024-04-15",
    budget: 12800000,
    actualSpent: 9600000,
    clientName: "City of Cedar Grove",
    contractors: [
      {
        id: "cont-008",
        name: "Olivia Jackson",
        role: "Accessibility Consultant",
        rate: 115,
        rateType: "hourly",
        hoursWorked: 240,
        totalPaid: 27600,
        startDate: "2023-02-15",
        status: "active",
        email: "ojackson@accessibility.org"
      }
    ],
    salesmen: [
      {
        id: "sale-006",
        name: "William Foster",
        commission: 35000,
        commissionType: "fixed",
        totalSales: 12800000,
        totalCommission: 35000,
        email: "wfoster@cityplanning.gov",
        phone: "555-567-8901"
      }
    ]
  },
  {
    id: 7,
    name: "Parkside Medical Center",
    type: "Healthcare",
    description: "Specialized medical facility with 120 beds, trauma center, 8 operating rooms, and cutting-edge diagnostic imaging department. Includes helipad and dedicated research wing.",
    location: "Parkside District",
    completion: 28,
    workers: 135,
    vehicles: 22,
    status: "In Progress",
    startDate: "2023-07-08",
    expectedEndDate: "2025-06-30",
    budget: 48500000,
    actualSpent: 13580000,
    clientName: "Regional Healthcare Systems",
    contractors: [
      {
        id: "cont-009",
        name: "Martha Rodriguez",
        role: "Medical Equipment Specialist",
        rate: 170,
        rateType: "hourly",
        hoursWorked: 190,
        totalPaid: 32300,
        startDate: "2023-07-01",
        status: "active",
        email: "martha.r@medequip.com"
      }
    ],
    salesmen: [
      {
        id: "sale-007",
        name: "Patricia Nelson",
        commission: 1.8,
        commissionType: "percentage",
        totalSales: 48500000,
        totalCommission: 873000,
        email: "pnelson@healthcare.org",
        phone: "555-678-9012"
      }
    ]
  },
  {
    id: 8,
    name: "Westview Mall Expansion",
    type: "Retail",
    description: "75,000 sq ft expansion of existing shopping mall, adding 35 new retail spaces, food court renovation, and multi-level parking structure with EV charging stations.",
    location: "West Commercial District",
    completion: 55,
    workers: 82,
    vehicles: 14,
    status: "In Progress",
    startDate: "2023-02-28",
    expectedEndDate: "2024-06-15",
    budget: 18500000,
    actualSpent: 10175000,
    clientName: "Westview Retail Properties",
    contractors: [
      {
        id: "cont-010",
        name: "Ryan Miller",
        role: "Retail Space Planner",
        rate: 135,
        rateType: "hourly",
        hoursWorked: 310,
        totalPaid: 41850,
        startDate: "2023-02-15",
        status: "active",
        email: "rmiller@retaildesign.com"
      }
    ],
    salesmen: [
      {
        id: "sale-008",
        name: "Diana Palmer",
        commission: 1.9,
        commissionType: "percentage",
        totalSales: 18500000,
        totalCommission: 351500,
        email: "diana@riverprops.com",
        phone: "555-234-5678"
      }
    ]
  },
  {
    id: 9,
    name: "Oceanfront Condominiums",
    type: "Residential",
    description: "Luxury 22-story condominium tower with 85 units, private beach access, underground parking, and hurricane-resistant construction. Features include smart home technology and concierge services.",
    location: "Beachfront District",
    completion: 40,
    workers: 95,
    vehicles: 18,
    status: "In Progress",
    startDate: "2023-06-10",
    expectedEndDate: "2025-01-20",
    budget: 34800000,
    actualSpent: 13920000,
    clientName: "Coastal Living Developers",
    contractors: [
      {
        id: "cont-011",
        name: "Sarah Chen",
        role: "Structural Engineer",
        rate: 145,
        rateType: "hourly",
        hoursWorked: 260,
        totalPaid: 37700,
        startDate: "2023-05-20",
        status: "active",
        email: "schen@construction.com"
      }
    ],
    salesmen: [
      {
        id: "sale-009",
        name: "Kevin Barnes",
        commission: 2.1,
        commissionType: "percentage",
        totalSales: 34800000,
        totalCommission: 730800,
        email: "kbarnes@coastal.com",
        phone: "555-789-0123"
      }
    ]
  },
  {
    id: 10,
    name: "Metro Transit Center",
    type: "Infrastructure",
    description: "Multi-modal transit hub connecting subway, bus, and light rail systems with 12 platforms, commercial spaces, and green roof. Features include rainwater collection system and solar panels.",
    location: "Central Metro District",
    completion: 68,
    workers: 130,
    vehicles: 25,
    status: "In Progress",
    startDate: "2023-01-25",
    expectedEndDate: "2024-08-15",
    budget: 29500000,
    actualSpent: 20060000,
    clientName: "Metropolitan Transit Authority",
    contractors: [
      {
        id: "cont-012",
        name: "Daniel Park",
        role: "Transportation Consultant",
        rate: 165,
        rateType: "hourly",
        hoursWorked: 480,
        totalPaid: 79200,
        startDate: "2023-01-10",
        status: "active",
        email: "dpark@transit.org"
      }
    ],
    salesmen: [
      {
        id: "sale-010",
        name: "William Foster",
        commission: 45000,
        commissionType: "fixed",
        totalSales: 29500000,
        totalCommission: 45000,
        email: "wfoster@cityplanning.gov",
        phone: "555-567-8901"
      }
    ]
  }
];

// Export for consistent reference
export const projects = initialProjects;
