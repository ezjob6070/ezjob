import React from 'react';
// Ensure proper imports
import { Technician } from '@/types/technician';
import { Job } from '@/types/job';

// Fix the component to correctly use the updated types
const ContractorsDashboard = ({ technicians, jobs }: { technicians: Technician[], jobs: Job[] }) => {
  // Filter contractors
  const contractors = technicians.filter(tech => tech.role === 'contractor');
  
  // Calculate metrics
  const calculateMetrics = (contractorId: string) => {
    // Use the correct properties from the Job type
    const contractorJobs = jobs.filter(job => 
      job.technicianId === contractorId && 
      new Date(job.date) >= new Date(new Date().setDate(new Date().getDate() - 30)) &&
      new Date(job.date) <= new Date()
    );

    const totalRevenue = contractorJobs.reduce((sum, job) => sum + (job.totalAmount || 0), 0);
    const jobCount = contractorJobs.length;
    
    return { totalRevenue, jobCount };
  };
  
  return (
    <div>
      <h2>Contractors Dashboard</h2>
      <ul>
        {contractors.map(contractor => {
          const metrics = calculateMetrics(contractor.id);
          return (
            <li key={contractor.id}>
              {contractor.name} - Total Revenue: ${metrics.totalRevenue}, Job Count: {metrics.jobCount}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContractorsDashboard;
