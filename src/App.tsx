
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
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
import FinanceTechnicians from "./pages/finance/FinanceTechnicians";
import Properties from "./pages/Properties";
import Listings from "./pages/Listings";
import { GlobalDateProvider } from "./components/GlobalDateRangeFilter";
import { GlobalStateProvider } from "./components/providers/GlobalStateProvider";

// Import construction pages
import Projects from "./pages/construction/Projects";
import Equipment from "./pages/construction/Equipment";
import Materials from "./pages/construction/Materials";
import Contractors from "./pages/construction/Contractors";
import SafetyReports from "./pages/construction/SafetyReports";
import Inspections from "./pages/construction/Inspections";

// Import general category pages
import Contacts from "./pages/general/Contacts";

const queryClient = new QueryClient();

function App() {
  return (
    <GlobalStateProvider>
      <GlobalDateProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Welcome page as the initial route */}
                <Route path="/" element={<Welcome />} />
                
                {/* Main layout with sidebar for all app pages */}
                <Route path="/" element={<Layout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="real-estate-dashboard" element={<RealEstateDashboard />} />
                  <Route path="agents" element={<RealEstateAgents />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="tasks/:id" element={<TaskDetail />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="technicians" element={<Technicians />} />
                  <Route path="technicians/analytics" element={<TechnicianAnalytics />} />
                  <Route path="technicians/:id" element={<TechnicianDetail />} />
                  <Route path="technician-altercation" element={<Navigate to="/technicians" replace />} />
                  <Route path="estimates" element={<Estimates />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="finance/technicians" element={<FinanceTechnicians />} />
                  <Route path="gps-tracking" element={<GPSTracking />} />
                  <Route path="job-sources" element={<JobSources />} />
                  <Route path="employed" element={<Employed />} />
                  <Route path="employed/employee/:id" element={<EmployeeDetail />} />
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Construction Routes */}
                  <Route path="projects" element={<Projects />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="materials" element={<Materials />} />
                  <Route path="contractors" element={<Contractors />} />
                  <Route path="safety-reports" element={<SafetyReports />} />
                  <Route path="inspections" element={<Inspections />} />
                  
                  {/* General Category Routes */}
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="communications" element={<Navigate to="/contacts" replace />} />
                  <Route path="general-projects" element={<Navigate to="/contacts" replace />} />
                  <Route path="office-management" element={<Navigate to="/contacts" replace />} />
                  <Route path="customer-support" element={<Navigate to="/contacts" replace />} />
                  <Route path="marketing" element={<Navigate to="/contacts" replace />} />
                  <Route path="knowledge-base" element={<Navigate to="/contacts" replace />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <QuickActions />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </GlobalDateProvider>
    </GlobalStateProvider>
  );
}

export default App;
