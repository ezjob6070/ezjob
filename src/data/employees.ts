
import { Employee, EmployeeStatus, Report, Resume, ResumeStatus, EmployeeNote, SalaryBasis } from "@/types/employee";

// Initialize with empty arrays or load from localStorage if available
export const initialEmployees: Employee[] = (() => {
  const savedEmployees = localStorage.getItem('employees');
  return savedEmployees ? JSON.parse(savedEmployees) : [];
})();

export const initialResumes: Resume[] = (() => {
  const savedResumes = localStorage.getItem('resumes');
  return savedResumes ? JSON.parse(savedResumes) : [];
})();

export const employeeReports: Report[] = (() => {
  const savedReports = localStorage.getItem('employeeReports');
  return savedReports ? JSON.parse(savedReports) : [];
})();
