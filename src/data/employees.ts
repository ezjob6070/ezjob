import { Employee, Report, Resume, EMPLOYEE_STATUS, RESUME_STATUS, SALARY_BASIS } from "@/types/employee";
import { addDays, subDays } from "date-fns";

// Generate demo employee data
const generateDemoEmployees = (): Employee[] => {
  const today = new Date();
  
  return [
    {
      id: "emp-001",
      name: "Alexander Brown",
      email: "alex.brown@example.com",
      phone: "555-123-4567",
      position: "Construction Manager",
      department: "Operations",
      location: "Main Office",
      hireDate: subDays(today, 365 * 2 + 45).toISOString(),
      status: EMPLOYEE_STATUS.ACTIVE,
      salary: 85000,
      salaryBasis: SALARY_BASIS.ANNUAL,
      manager: "Richard Miller",
      emergencyContact: {
        name: "Emma Brown",
        relation: "Spouse",
        phone: "555-765-4321"
      },
      documents: [
        { id: "doc-1", name: "Employment Contract", url: "/documents/contract-001.pdf", uploadDate: subDays(today, 365 * 2 + 45).toISOString() },
        { id: "doc-2", name: "Safety Certification", url: "/documents/safety-cert-001.pdf", uploadDate: subDays(today, 180).toISOString() }
      ],
      notes: [
        { id: "note-1", content: "Completed leadership training program", date: subDays(today, 120).toISOString(), author: "HR Admin" },
        { id: "note-2", content: "Received Employee of the Month award", date: subDays(today, 45).toISOString(), author: "CEO" }
      ]
    },
    {
      id: "emp-002",
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      phone: "555-987-6543",
      position: "Project Engineer",
      department: "Engineering",
      location: "Main Office",
      hireDate: subDays(today, 365 + 78).toISOString(),
      status: EMPLOYEE_STATUS.ACTIVE,
      salary: 72000,
      salaryBasis: SALARY_BASIS.ANNUAL,
      manager: "Alexander Brown",
      emergencyContact: {
        name: "Carlos Martinez",
        relation: "Brother",
        phone: "555-234-5678"
      },
      documents: [
        { id: "doc-3", name: "Employment Contract", url: "/documents/contract-002.pdf", uploadDate: subDays(today, 365 + 78).toISOString() },
        { id: "doc-4", name: "Engineering License", url: "/documents/eng-license-002.pdf", uploadDate: subDays(today, 365 + 60).toISOString() }
      ],
      notes: [
        { id: "note-3", content: "Successfully completed Bridge project under budget", date: subDays(today, 90).toISOString(), author: "Alexander Brown" }
      ]
    },
    {
      id: "emp-003",
      name: "Marcus Johnson",
      email: "marcus.j@example.com",
      phone: "555-456-7890",
      position: "Site Supervisor",
      department: "Operations",
      location: "Field",
      hireDate: subDays(today, 365 * 3 + 42).toISOString(),
      status: EMPLOYEE_STATUS.ACTIVE,
      salary: 68000,
      salaryBasis: SALARY_BASIS.ANNUAL,
      manager: "Alexander Brown",
      emergencyContact: {
        name: "Tanya Johnson",
        relation: "Spouse",
        phone: "555-345-6789"
      },
      documents: [
        { id: "doc-5", name: "Employment Contract", url: "/documents/contract-003.pdf", uploadDate: subDays(today, 365 * 3 + 42).toISOString() },
        { id: "doc-6", name: "Safety Manager Certification", url: "/documents/safety-cert-003.pdf", uploadDate: subDays(today, 220).toISOString() }
      ],
      notes: []
    },
    {
      id: "emp-004",
      name: "Olivia Taylor",
      email: "o.taylor@example.com",
      phone: "555-234-5678",
      position: "Architect",
      department: "Design",
      location: "Main Office",
      hireDate: subDays(today, 365 + 150).toISOString(),
      status: EMPLOYEE_STATUS.ACTIVE,
      salary: 78000,
      salaryBasis: SALARY_BASIS.ANNUAL,
      manager: "Richard Miller",
      emergencyContact: {
        name: "James Taylor",
        relation: "Father",
        phone: "555-876-5432"
      },
      documents: [
        { id: "doc-7", name: "Employment Contract", url: "/documents/contract-004.pdf", uploadDate: subDays(today, 365 + 150).toISOString() },
        { id: "doc-8", name: "Architecture License", url: "/documents/arch-license-004.pdf", uploadDate: subDays(today, 365 + 145).toISOString() }
      ],
      notes: [
        { id: "note-4", content: "Received award for innovative design on City Center Tower project", date: subDays(today, 60).toISOString(), author: "Design Director" }
      ]
    },
    {
      id: "emp-005",
      name: "Daniel Wilson",
      email: "d.wilson@example.com",
      phone: "555-345-6789",
      position: "Heavy Equipment Operator",
      department: "Operations",
      location: "Field",
      hireDate: subDays(today, 365 * 2 + 200).toISOString(),
      status: EMPLOYEE_STATUS.ACTIVE,
      salary: 31,
      salaryBasis: SALARY_BASIS.HOURLY,
      manager: "Marcus Johnson",
      emergencyContact: {
        name: "Lisa Wilson",
        relation: "Spouse",
        phone: "555-765-4321"
      },
      documents: [
        { id: "doc-9", name: "Employment Contract", url: "/documents/contract-005.pdf", uploadDate: subDays(today, 365 * 2 + 200).toISOString() },
        { id: "doc-10", name: "Heavy Equipment License", url: "/documents/equip-license-005.pdf", uploadDate: subDays(today, 365).toISOString() }
      ],
      notes: []
    }
  ];
};

// Generate demo resume data for job applicants
const generateDemoResumes = (): Resume[] => {
  const today = new Date();
  
  return [
    {
      id: "resume-001",
      name: "Jennifer Lawrence",
      email: "j.lawrence@example.com",
      phone: "555-111-2222",
      position: "Project Manager",
      experience: "8 years",
      education: "MBA, Construction Management",
      status: RESUME_STATUS.NEW,
      submittedDate: subDays(today, 3).toISOString(),
      resumeUrl: "/resumes/resume-001.pdf",
      coverLetterUrl: "/resumes/cover-001.pdf",
      notes: "Strong experience with commercial projects",
      dateSubmitted: subDays(today, 3).toISOString()
    },
    {
      id: "resume-002",
      name: "Michael Chang",
      email: "m.chang@example.com",
      phone: "555-333-4444",
      position: "Civil Engineer",
      experience: "5 years",
      education: "BS Civil Engineering",
      status: RESUME_STATUS.REVIEWING,
      submittedDate: subDays(today, 7).toISOString(),
      resumeUrl: "/resumes/resume-002.pdf",
      notes: "Experience with infrastructure projects",
      dateSubmitted: subDays(today, 7).toISOString()
    },
    {
      id: "resume-003",
      name: "Samantha Jones",
      email: "s.jones@example.com",
      phone: "555-555-6666",
      position: "Safety Officer",
      experience: "10 years",
      education: "BS Occupational Safety",
      status: RESUME_STATUS.INTERVIEW,
      submittedDate: subDays(today, 14).toISOString(),
      resumeUrl: "/resumes/resume-003.pdf",
      coverLetterUrl: "/resumes/cover-003.pdf",
      notes: "Extensive experience with OSHA regulations",
      dateSubmitted: subDays(today, 14).toISOString()
    },
    {
      id: "resume-004",
      name: "David Patel",
      email: "d.patel@example.com",
      phone: "555-777-8888",
      position: "Estimator",
      experience: "6 years",
      education: "BS Construction Management",
      status: RESUME_STATUS.REJECTED,
      submittedDate: subDays(today, 20).toISOString(),
      resumeUrl: "/resumes/resume-004.pdf",
      notes: "Good experience but lacking software skills needed",
      dateSubmitted: subDays(today, 20).toISOString()
    },
    {
      id: "resume-005",
      name: "Elizabeth Chen",
      email: "e.chen@example.com",
      phone: "555-999-0000",
      position: "Interior Designer",
      experience: "4 years",
      education: "BFA Interior Design",
      status: RESUME_STATUS.NEW,
      submittedDate: subDays(today, 2).toISOString(),
      resumeUrl: "/resumes/resume-005.pdf",
      coverLetterUrl: "/resumes/cover-005.pdf",
      notes: "Strong portfolio with commercial projects",
      dateSubmitted: subDays(today, 2).toISOString()
    }
  ];
};

// Generate demo employee reports
const generateDemoReports = (): Report[] => {
  const today = new Date();
  
  return [
    {
      id: "report-001",
      title: "Quarterly Safety Audit",
      description: "Results of Q1 construction site safety inspections",
      author: "Alexander Brown",
      department: "Operations",
      date: subDays(today, 30).toISOString(),
      documentUrl: "/reports/safety-q1.pdf",
      shared: ["Sophia Martinez", "Marcus Johnson"]
    },
    {
      id: "report-002",
      title: "Project Performance Review",
      description: "Analysis of project completion times and budget adherence",
      author: "Sophia Martinez",
      department: "Engineering",
      date: subDays(today, 45).toISOString(),
      documentUrl: "/reports/performance-q1.pdf",
      shared: ["Alexander Brown", "Richard Miller"]
    },
    {
      id: "report-003",
      title: "Equipment Utilization",
      description: "Monthly report on heavy equipment usage efficiency",
      author: "Marcus Johnson",
      department: "Operations",
      date: subDays(today, 15).toISOString(),
      documentUrl: "/reports/equipment-march.pdf",
      shared: ["Alexander Brown", "Daniel Wilson"]
    },
    {
      id: "report-004",
      title: "Design Innovation Proposal",
      description: "New sustainable design approaches for upcoming projects",
      author: "Olivia Taylor",
      department: "Design",
      date: subDays(today, 7).toISOString(),
      documentUrl: "/reports/design-innovation.pdf",
      shared: ["Richard Miller", "Alexander Brown"]
    }
  ];
};

// Initialize with demo data
export const initialEmployees: Employee[] = generateDemoEmployees();
export const initialResumes: Resume[] = generateDemoResumes();
export const employeeReports: Report[] = generateDemoReports();
