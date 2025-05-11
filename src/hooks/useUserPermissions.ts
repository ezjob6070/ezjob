
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Job } from "@/types/job";
import { Technician } from "@/types/technician";

export function useUserPermissions() {
  const { currentUser } = useGlobalState();

  // Check if a user can view a specific job
  const canViewJob = (job: Job): boolean => {
    // If no user is logged in or they're an admin/manager, they can see everything
    if (!currentUser || currentUser.userPermission === 'admin' || currentUser.userPermission === 'manager') {
      return true;
    }

    // If user has the "view own jobs only" permission, check if job belongs to them
    if (currentUser.canViewOwnJobsOnly) {
      return job.technicianId === currentUser.id || job.technician === currentUser.id;
    }

    // By default, allow viewing
    return true;
  };

  // Filter jobs based on user permissions
  const filterJobsByPermission = (jobs: Job[]): Job[] => {
    // If no user is logged in or they don't have viewing restrictions, return all jobs
    if (!currentUser || !currentUser.canViewOwnJobsOnly) {
      return jobs;
    }

    // Filter jobs to only those assigned to the current user
    return jobs.filter(job => 
      job.technicianId === currentUser.id || job.technician === currentUser.id
    );
  };

  // Check if user has admin-level permissions
  const isAdmin = (): boolean => {
    return currentUser?.userPermission === 'admin';
  };

  // Check if user has at least manager-level permissions
  const isManagerOrAbove = (): boolean => {
    return currentUser?.userPermission === 'admin' || currentUser?.userPermission === 'manager';
  };

  return {
    canViewJob,
    filterJobsByPermission,
    isAdmin,
    isManagerOrAbove,
    currentUser
  };
}
