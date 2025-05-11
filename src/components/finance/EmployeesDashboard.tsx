import React from 'react';
// Ensure proper imports
import { Technician } from '@/types/technician';

// Fix the component to correctly use the updated types
const EmployeesDashboard = ({ technicians }: { technicians: Technician[] }) => {
  // Filter employees
  const employees = technicians.filter(tech => tech.role === 'employed');

  // Calculate metrics
  const calculateTotalSalary = () => {
    return employees.reduce((sum, employee) => sum + (employee.monthlySalary || 0), 0);
  };

  const calculateAverageSalary = () => {
    const totalSalary = calculateTotalSalary();
    return employees.length > 0 ? totalSalary / employees.length : 0;
  };

  const calculatePeriodPayment = () => {
    return employees.reduce((sum, employee) => sum + (employee.periodPayment || 0), 0);
  };

  // Render employee details
  const renderEmployeeDetails = (employee: Technician & { periodPayment: number, monthlySalary: number }) => {
    const subRoleDisplay = employee.subRole ? employee.subRole : 'N/A';
    return (
      <div key={employee.id} className="border rounded-md p-4 mb-2">
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <p>Email: {employee.email}</p>
        <p>Phone: {employee.phone}</p>
        <p>Position: {employee.position}</p>
        <p>Department: {employee.department}</p>
        <p>Sub-Role: {subRoleDisplay}</p>
        <p>Monthly Salary: ${employee.monthlySalary}</p>
        <p>Period Payment: ${employee.periodPayment}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employees Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-3xl">{employees.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold">Total Salary</h3>
          <p className="text-3xl">${calculateTotalSalary()}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold">Average Salary</h3>
          <p className="text-3xl">${calculateAverageSalary().toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold">Total Period Payment</h3>
          <p className="text-3xl">${calculatePeriodPayment()}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Employee Details</h3>
        {employees.map(employee => renderEmployeeDetails(employee as Technician & { periodPayment: number, monthlySalary: number }))}
      </div>
    </div>
  );
};

export default EmployeesDashboard;
