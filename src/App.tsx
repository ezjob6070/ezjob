
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import ConstructionDashboard from "./pages/ConstructionDashboard";
import GeneralDashboard from "./pages/GeneralDashboard";
import RealEstateAgents from "./pages/RealEstateAgents";
import Clients from "./pages/Clients";
import Leads from "./pages/Leads";
import LeadsClients from "./pages/LeadsClients";
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
import AddEmployee from "./pages/AddEmployee";
import Schedule from "./pages/Schedule";
import TechnicianAltercation from "./pages/TechnicianAltercation";
import TechnicianAnalytics from "./pages/TechnicianAnalytics";
import TechnicianDetail from "./pages/TechnicianDetail";
import FinanceTechnicians from "./pages/finance/FinanceTechnicians";
import Properties from "./pages/Properties";
import Listings from "./pages/Listings";
import ProjectsOverview from "./pages/Projects"; // Renamed import
import ProjectDetail from "./pages/ProjectDetail"; // New import
import { GlobalDateProvider } from "./components/GlobalDateRangeFilter";
import { GlobalStateProvider } from "./components/providers/GlobalStateProvider";

// Import call pages
import Calls from "./pages/Calls";
import IncomingCalls from "./pages/calls/IncomingCalls";
import OutgoingCalls from "./pages/calls/OutgoingCalls";
import MissedCalls from "./pages/calls/MissedCalls";
import ConvertedCalls from "./pages/calls/ConvertedCalls";

// Import construction pages
import ConstructionProjects from "./pages/construction/Projects"; // Renamed import
import Equipment from "./pages/construction/Equipment";
import Materials from "./pages/construction/Materials";
import Contractors from "./pages/construction/Contractors";
import SafetyReports from "./pages/construction/SafetyReports";
import Inspections from "./pages/construction/Inspections";

// Import general category pages
import Contacts from "./pages/general/Contacts";

// Import project pages
import ProjectsInProgress from "./pages/projects/InProgress";
import ProjectsAll from "./pages/projects/All";
import ProjectsTotal from "./pages/projects/Total";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStateProvider>
        <GlobalDateProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Welcome page as the initial route */}
                <Route path="/" element={<Welcome />} />
                
                {/* Main layout with sidebar for all app pages */}
                <Route path="/" element={<Layout />}>
                  {/* Dashboard routes for different industries */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="real-estate-dashboard" element={<RealEstateDashboard />} />
                  <Route path="construction-dashboard" element={<ConstructionDashboard />} />
                  <Route path="general-dashboard" element={<GeneralDashboard />} />
                  
                  <Route path="agents" element={<RealEstateAgents />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="leads-clients" element={<LeadsClients />} />
                  
                  {/* Project routes */}
                  <Route path="projects" element={<ProjectsOverview />} />
                  <Route path="projects/in-progress" element={<ProjectsInProgress />} />
                  <Route path="projects/all" element={<ProjectsAll />} />
                  <Route path="projects/total" element={<ProjectsTotal />} />
                  <Route path="project/:id" element={<ProjectDetail />} />
                  
                  {/* Call tracking routes */}
                  <Route path="calls" element={<Calls />} />
                  <Route path="calls/incoming" element={<IncomingCalls />} />
                  <Route path="calls/outgoing" element={<OutgoingCalls />} />
                  <Route path="calls/missed" element={<MissedCalls />} />
                  <Route path="calls/converted" element={<ConvertedCalls />} />
                  
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
                  <Route path="employed/add" element={<AddEmployee />} />
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Construction Routes */}
                  <Route path="construction-projects" element={<ConstructionProjects />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="materials" element={<Materials />} />
                  <Route path="contractors" element={<Contractors />} />
                  <Route path="safety-reports" element={<SafetyReports />} />
                  <Route path="inspections" element={<Inspections />} />
                  
                  {/* General Category Routes */}
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="communications" element={<Navigate to="/contacts" replace />} />
                  <Route path="general-projects" element={<Navigate to="/projects" replace />} />
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
        </GlobalDateProvider>
      </GlobalStateProvider>
    </QueryClientProvider>
  );
}

export default App;
