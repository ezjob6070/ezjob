import { Employee, EmployeeStatus, Report, Resume, ResumeStatus, EmployeeNote, SalaryBasis } from "@/types/employee";

export const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    position: "HR Manager",
    department: "Human Resources",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2021-03-15",
    hireDate: "2021-03-15",
    salary: 75000,
    salaryBasis: SalaryBasis.YEARLY,
    address: "123 Main St, Anytown, CA 12345",
    skills: ["Recruitment", "Employee Relations", "Conflict Resolution", "Policy Development"],
    dateOfBirth: "1985-06-15",
    background: "John has over 10 years of experience in Human Resources Management. He previously worked at XYZ Corp where he implemented numerous employee wellness programs that reduced turnover by 15%",
    education: [
      "MBA in Human Resource Management, University of California, 2010",
      "Bachelor's in Business Administration, State University, 2007"
    ],
    certifications: ["PHR (Professional in Human Resources)", "SHRM-CP"],
    performanceRating: 4,
    notes: [
      {
        id: "note-1",
        content: "John successfully led the implementation of the new HRIS system, completing the project under budget and ahead of schedule.",
        createdAt: "2022-05-20",
        createdBy: "Michael Davis"
      }
    ]
  },
  {
    id: "emp-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 234-5678",
    position: "Marketing Specialist",
    department: "Marketing",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2020-06-22",
    hireDate: "2020-06-22",
    salaryBasis: SalaryBasis.YEARLY,
    reportsTo: "emp-5",
    salary: 62000,
    address: "456 Oak Ave, Anytown, CA 12345",
    skills: ["Social Media Marketing", "Content Creation", "SEO", "Analytics"],
    dateOfBirth: "1992-11-30",
    background: "Sarah specializes in digital marketing with a focus on social media campaigns. She has experience in both B2B and B2C marketing environments and has managed campaigns with budgets exceeding $500,000.",
    education: [
      "Bachelor's in Marketing, Pacific University, 2015"
    ],
    emergencyContact: {
      name: "Robert Johnson",
      relationship: "Brother",
      phone: "(555) 987-6543"
    },
    performanceRating: 5
  },
  {
    id: "emp-3",
    name: "David Williams",
    email: "david.williams@example.com",
    phone: "(555) 345-6789",
    position: "Software Developer",
    department: "Engineering",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2022-01-10",
    hireDate: "2022-01-10",
    salaryBasis: SalaryBasis.YEARLY,
    reportsTo: "emp-6",
    salary: 85000,
    address: "789 Pine St, Anytown, CA 12345",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    background: "David is a full-stack developer with particular expertise in React and Node.js. He previously worked at a fintech startup where he built scalable APIs and microservices.",
    certifications: ["AWS Certified Developer", "MongoDB Certified Developer"],
    performanceRating: 4
  },
  {
    id: "emp-4",
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "(555) 456-7890",
    position: "Accountant",
    department: "Finance",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2019-11-05",
    hireDate: "2019-11-05",
    salaryBasis: SalaryBasis.YEARLY,
    reportsTo: "emp-7",
    salary: 68000,
    address: "321 Elm St, Anytown, CA 12345",
    skills: ["Financial Analysis", "Budgeting", "Tax Preparation", "Reconciliation"],
    dateOfBirth: "1988-04-10",
    background: "Emily has 10 years of experience in accounting and finance. She has worked in both public and private sectors and has a strong track record of financial reporting and analysis.",
    education: [
      "Bachelor's in Accounting, University of California, 2012"
    ],
    performanceRating: 4
  },
  {
    id: "emp-5",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "(555) 567-8901",
    position: "Marketing Director",
    department: "Marketing",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2018-08-20",
    hireDate: "2018-08-20",
    salaryBasis: SalaryBasis.YEARLY,
    salary: 95000,
    address: "654 Maple Ave, Anytown, CA 12345",
    skills: ["Brand Strategy", "Marketing Campaigns", "Team Management", "Budget Planning"],
    dateOfBirth: "1979-02-12",
    background: "Michael has over 15 years of experience in marketing. He has worked in both B2B and B2C industries and has a proven track record of driving sales and increasing brand awareness.",
    education: [
      "MBA in Marketing, Stanford University, 2014"
    ],
    performanceRating: 5
  },
  {
    id: "emp-6",
    name: "Jennifer Wilson",
    email: "jennifer.wilson@example.com",
    phone: "(555) 678-9012",
    position: "Engineering Manager",
    department: "Engineering",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2017-05-15",
    hireDate: "2017-05-15",
    salaryBasis: SalaryBasis.YEARLY,
    salary: 110000,
    address: "987 Cedar St, Anytown, CA 12345",
    skills: ["Project Management", "Software Architecture", "Team Leadership", "Agile Methodologies"],
    dateOfBirth: "1980-09-18",
    background: "Jennifer has over 10 years of experience in engineering management. She has worked in both startups and established companies and has a strong track record of leading teams to success.",
    education: [
      "Bachelor's in Computer Science, University of California, 2008"
    ],
    performanceRating: 4
  },
  {
    id: "emp-7",
    name: "Robert Miller",
    email: "robert.miller@example.com",
    phone: "(555) 789-0123",
    position: "Finance Director",
    department: "Finance",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2016-09-01",
    hireDate: "2016-09-01",
    salaryBasis: SalaryBasis.YEARLY,
    salary: 105000,
    address: "159 Birch St, Anytown, CA 12345",
    skills: ["Financial Planning", "Risk Management", "Strategic Planning", "Investment Analysis"],
    dateOfBirth: "1976-03-25",
    background: "Robert has over 12 years of experience in finance. He has worked in both public and private sectors and has a strong track record of financial analysis and risk management.",
    education: [
      "Bachelor's in Finance, University of California, 2009"
    ],
    performanceRating: 5
  },
  {
    id: "emp-8",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "(555) 890-1234",
    position: "Customer Service Rep",
    department: "Customer Support",
    status: EmployeeStatus.INACTIVE,
    dateHired: "2020-02-15",
    hireDate: "2020-02-15",
    salaryBasis: SalaryBasis.YEARLY,
    reportsTo: "emp-9",
    salary: 45000,
    address: "753 Willow St, Anytown, CA 12345",
    skills: ["Communication", "Problem Solving", "Customer Relations", "CRM Software"],
    dateOfBirth: "1982-07-14",
    background: "Lisa has 8 years of experience in customer service. She has worked in both retail and hospitality industries and has a strong track record of resolving customer complaints and providing excellent customer service.",
    education: [
      "Bachelor's in Business Administration, University of California, 2010"
    ],
    performanceRating: 4
  },
  {
    id: "emp-9",
    name: "Thomas Taylor",
    email: "thomas.taylor@example.com",
    phone: "(555) 901-2345",
    position: "Customer Support Manager",
    department: "Customer Support",
    status: EmployeeStatus.ACTIVE,
    dateHired: "2019-07-10",
    hireDate: "2019-07-10",
    salaryBasis: SalaryBasis.YEARLY,
    salary: 72000,
    address: "852 Spruce St, Anytown, CA 12345",
    skills: ["Team Management", "Customer Experience", "Conflict Resolution", "Support Metrics"],
    dateOfBirth: "1984-01-05",
    background: "Thomas has over 10 years of experience in customer support. He has worked in both retail and hospitality industries and has a strong track record of managing teams and resolving customer complaints.",
    education: [
      "Bachelor's in Business Administration, University of California, 2011"
    ],
    performanceRating: 5
  }
];

export const initialResumes: Resume[] = [
  {
    id: "res-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 111-2222",
    position: "Software Developer",
    experience: "5 years",
    status: ResumeStatus.PENDING,
    dateSubmitted: "2023-10-15",
    resumeUrl: "/path/to/resume1.pdf",
    notes: "Strong JavaScript and React experience. Referred by David Williams."
  },
  {
    id: "res-2",
    name: "Morgan Lee",
    email: "morgan.lee@example.com",
    phone: "(555) 222-3333",
    position: "Marketing Coordinator",
    experience: "3 years",
    status: ResumeStatus.APPROVED,
    dateSubmitted: "2023-10-10",
    resumeUrl: "/path/to/resume2.pdf",
    notes: "Good fit for the marketing team. Schedule for interview next week."
  },
  {
    id: "res-3",
    name: "Jordan Patel",
    email: "jordan.patel@example.com",
    phone: "(555) 333-4444",
    position: "HR Specialist",
    experience: "7 years",
    status: ResumeStatus.REJECTED,
    dateSubmitted: "2023-10-05",
    resumeUrl: "/path/to/resume3.pdf",
    notes: "Not enough experience in employee benefits administration."
  },
  {
    id: "res-4",
    name: "Taylor Wilson",
    email: "taylor.wilson@example.com",
    phone: "(555) 444-5555",
    position: "Financial Analyst",
    experience: "2 years",
    status: ResumeStatus.PENDING,
    dateSubmitted: "2023-10-12",
    resumeUrl: "/path/to/resume4.pdf",
    notes: "Recently graduated with MBA. Limited experience but shows potential."
  },
  {
    id: "res-5",
    name: "Casey Martinez",
    email: "casey.martinez@example.com",
    phone: "(555) 555-6666",
    position: "Customer Service Representative",
    experience: "4 years",
    status: ResumeStatus.PENDING,
    dateSubmitted: "2023-10-14",
    resumeUrl: "/path/to/resume5.pdf",
    notes: "Excellent communication skills. Previous experience in retail customer service."
  }
];

export const employeeReports: Report[] = [
  {
    id: "rep-1",
    employeeId: "emp-2",
    title: "Q3 Marketing Campaign Results",
    description: "Detailed analysis of Q3 social media campaign performance and ROI metrics.",
    status: "completed",
    dateSubmitted: "2023-10-01",
    date: "2023-10-01",
    type: "Marketing Report",
    author: "Sarah Johnson"
  },
  {
    id: "rep-2",
    employeeId: "emp-3",
    title: "New Feature Implementation Plan",
    description: "Technical specification and implementation timeline for the new customer dashboard features.",
    status: "in-progress",
    dateSubmitted: "2023-10-08",
    date: "2023-10-08",
    type: "Technical Report",
    author: "David Williams"
  },
  {
    id: "rep-3",
    employeeId: "emp-4",
    title: "Monthly Financial Statement",
    description: "September 2023 financial statements including profit & loss, balance sheet, and cash flow analysis.",
    status: "completed",
    dateSubmitted: "2023-10-05",
    date: "2023-10-05",
    type: "Financial Report",
    author: "Emily Brown"
  },
  {
    id: "rep-4",
    employeeId: "emp-8",
    title: "Customer Support Training Manual Update",
    description: "Updated procedures for handling escalated support tickets and using the new CRM features.",
    status: "pending",
    dateSubmitted: "2023-10-12",
    date: "2023-10-12",
    type: "Training Material",
    author: "Lisa Anderson"
  },
  {
    id: "rep-5",
    employeeId: "emp-2",
    title: "Q4 Marketing Strategy Proposal",
    description: "Proposed marketing initiatives for Q4 with budget allocation and expected outcomes.",
    status: "in-progress",
    dateSubmitted: "2023-10-10",
    date: "2023-10-10",
    type: "Strategy Document",
    author: "Sarah Johnson"
  }
];
