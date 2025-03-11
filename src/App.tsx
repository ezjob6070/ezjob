
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import RealEstateAgents from "./pages/RealEstateAgents";
import Clients from "./pages/Clients";
import Leads from "./pages/Leads";
import ClientDetail from "./pages/ClientDetail";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import QuickActions from "./components/QuickActions";
import Jobs from "./pages/Jobs";
import Payments from "./pages/Payments";
import Technicians from "./pages/Technicians";
import Estimates from "./pages/Estimates";
import Finance from "./pages/Finance";
import JobSources from "./pages/JobSources";
import GPSTracking from "./pages/GPSTracking";
import Employed from "./pages/Employed";
import EmployeeDetail from "./pages/EmployeeDetail";
import Schedule from "./pages/Schedule";
import TechnicianAltercation from "./pages/TechnicianAltercation";
import TechnicianAnalytics from "./pages/TechnicianAnalytics";
import TechnicianDetail from "./pages/TechnicianDetail";
import { GlobalDateProvider } from "./components/GlobalDateRangeFilter";

const queryClient = new QueryClient();

function App() {
  return (
    <GlobalDateProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="real-estate-dashboard" element={<RealEstateDashboard />} />
                <Route path="agents" element={<RealEstateAgents />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="leads" element={<Leads />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="payments" element={<Payments />} />
                <Route path="technicians" element={<TechnicianAltercation />} />
                <Route path="technicians/:id" element={<TechnicianDetail />} />
                <Route path="technicians/analytics" element={<TechnicianAnalytics />} />
                <Route path="technician-altercation" element={<Navigate to="/technicians" replace />} />
                <Route path="estimates" element={<Estimates />} />
                <Route path="finance" element={<Finance />} />
                <Route path="gps-tracking" element={<GPSTracking />} />
                <Route path="job-sources" element={<JobSources />} />
                <Route path="employed" element={<Employed />} />
                <Route path="employed/employee/:id" element={<EmployeeDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <QuickActions />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalDateProvider>
  );
}

export default App;
