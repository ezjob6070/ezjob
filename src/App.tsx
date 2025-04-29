import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Layout Component
import Layout from "./components/Layout";

// Page Components
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import Leads from "./pages/Leads";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Schedule from "./pages/Schedule";
import Estimates from "./pages/Estimates";
import Payments from "./pages/Payments";
import Finance from "./pages/Finance";
import FinanceOverview from "./pages/finance/FinanceOverview";
import FinanceTechnicians from "./pages/finance/FinanceTechnicians";
import FinanceJobSources from "./pages/finance/FinanceJobSources";
import FinanceTransactions from "./pages/finance/FinanceTransactions";
import Settings from "./pages/Settings";

// Service Industry Pages
import Jobs from "./pages/Jobs";
import Technicians from "./pages/Technicians";
import TechnicianDetail from "./pages/TechnicianDetail";
import TechnicianAltercation from "./pages/TechnicianAltercation";
import TechnicianAnalytics from "./pages/TechnicianAnalytics";
import Employed from "./pages/Employed";
import EmployeeDetail from "./pages/EmployeeDetail";
import GPSTracking from "./pages/GPSTracking";
import JobSources from "./pages/JobSources";

// Real Estate Pages
import Properties from "./pages/Properties";
import RealEstateAgents from "./pages/RealEstateAgents";
import Listings from "./pages/Listings";

// Construction Pages
import Projects from "./pages/construction/Projects";
import Equipment from "./pages/construction/Equipment";
import Materials from "./pages/construction/Materials";
import Contractors from "./pages/construction/Contractors";
import SafetyReports from "./pages/construction/SafetyReports";
import Inspections from "./pages/construction/Inspections";

// General CRM Pages
import Contacts from "./pages/general/Contacts";
import GeneralDashboard from "./pages/general/Dashboard";

// Error Pages
import NotFound from "./pages/NotFound";

// Providers
import { GlobalStateProvider } from "./components/providers/GlobalStateProvider";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <GlobalStateProvider>
      <Toaster />
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
          You are currently offline. Some features may not be available.
        </div>
      )}
    <Routes>
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/real-estate-dashboard" element={<Layout><RealEstateDashboard /></Layout>} />
      <Route path="/leads" element={<Layout><Leads /></Layout>} />
      <Route path="/clients" element={<Layout><Clients /></Layout>} />
      <Route path="/clients/:id" element={<Layout><ClientDetail /></Layout>} />
      <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
      <Route path="/tasks/:id" element={<Layout><TaskDetail /></Layout>} />
      <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
      <Route path="/estimates" element={<Layout><Estimates /></Layout>} />
      <Route path="/payments" element={<Layout><Payments /></Layout>} />
      <Route path="/finance" element={<Layout><Finance /></Layout>} />
      <Route path="/finance/overview" element={<Layout><FinanceOverview /></Layout>} />
      <Route path="/finance/technicians" element={<Layout><FinanceTechnicians /></Layout>} />
      <Route path="/finance/job-sources" element={<Layout><FinanceJobSources /></Layout>} />
      <Route path="/finance/transactions" element={<Layout><FinanceTransactions /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      
      {/* Service Industry Routes */}
      <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
      <Route path="/technicians" element={<Layout><Technicians /></Layout>} />
      <Route path="/technicians/:id" element={<Layout><TechnicianDetail /></Layout>} />
      <Route path="/technicians/analytics" element={<Layout><TechnicianAnalytics /></Layout>} />
      <Route path="/technicians/altercation" element={<Layout><TechnicianAltercation /></Layout>} />
      <Route path="/employed" element={<Layout><Employed /></Layout>} />
      <Route path="/employed/:id" element={<Layout><EmployeeDetail /></Layout>} />
      <Route path="/gps-tracking" element={<Layout><GPSTracking /></Layout>} />
      <Route path="/job-sources" element={<Layout><JobSources /></Layout>} />
      
      {/* Real Estate Industry Routes */}
      <Route path="/properties" element={<Layout><Properties /></Layout>} />
      <Route path="/agents" element={<Layout><RealEstateAgents /></Layout>} />
      <Route path="/listings" element={<Layout><Listings /></Layout>} />
      
      {/* Construction Industry Routes */}
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/equipment" element={<Layout><Equipment /></Layout>} />
      <Route path="/materials" element={<Layout><Materials /></Layout>} />
      <Route path="/contractors" element={<Layout><Contractors /></Layout>} />
      <Route path="/safety-reports" element={<Layout><SafetyReports /></Layout>} />
      <Route path="/inspections" element={<Layout><Inspections /></Layout>} />

      {/* General CRM Routes */}
      <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
      <Route path="/general-dashboard" element={<Layout><GeneralDashboard /></Layout>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
    </GlobalStateProvider>
  );
}

export default App;
