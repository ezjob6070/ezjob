
import { useState, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TasksAndProgress from "./pages/TasksAndProgress"
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ClientDetail from './pages/ClientDetail'
import Clients from './pages/Clients'
import { initialProjects } from './data/projects'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [projects, setProjects] = useState(initialProjects)

  useEffect(() => {
    const authRoutes = ['/', '/projects', '/clients', '/tasks']

    // Simple navigation logic to ensure users can access the main pages
    if (!authRoutes.includes(location.pathname) && 
        !location.pathname.includes('/projects/') && 
        !location.pathname.includes('/clients/')) {
      navigate('/')
    }
  }, [location, navigate])

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clients/:id" element={<ClientDetail />} />
      <Route path="/tasks" element={<TasksAndProgress />} />
    </Routes>
  )
}

export default App
