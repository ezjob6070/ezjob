
import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import JobsPage from './pages/Jobs';
import Estimates from './pages/Estimates';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Technicians from './pages/Technicians';
import Reports from './pages/Reports';
import ProjectDetail from './pages/ProjectDetail';
import TechnicianDetail from './pages/TechnicianDetail';
import Finance from './pages/Finance';
import { GlobalStateProvider } from './components/providers/GlobalStateProvider';
import CompanyProfile from './pages/CompanyProfile';
import TasksAndProgress from './pages/TasksAndProgress';

function App() {
  useEffect(() => {
    document.title = "TechService Solutions";
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "jobs", element: <JobsPage /> },
        { path: "estimates", element: <Estimates /> },
        { path: "projects", element: <Projects /> },
        { path: "projects/:id", element: <ProjectDetail /> },
        { path: "schedule", element: <Calendar /> },
        { path: "calendar", element: <Calendar /> },
        { path: "technicians", element: <Technicians /> },
        { path: "technicians/:id", element: <TechnicianDetail /> },
        { path: "reports", element: <Reports /> },
        { path: "finance", element: <Finance /> },
        { path: "company-profile", element: <CompanyProfile /> },
        { path: "tasks-and-progress", element: <TasksAndProgress /> },
      ],
    },
  ]);

  return (
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  );
}

export default App;
