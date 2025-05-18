import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { useAuth } from './context/AuthContext'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Projects } from './pages/Projects'
import { Clients } from './pages/Clients'
import { initialClients } from './data/clients'
import { initialProjects } from './data/projects'
import { ClientDetail } from './pages/ClientDetail'
import { ProjectDetail } from './pages/ProjectDetail'
import TasksAndProgress from "./pages/TasksAndProgress";

function App() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [clients, setClients] = useState(initialClients)
  const [projects, setProjects] = useState(initialProjects)

  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
    const authRoutes = ['/', '/projects', '/clients']

    if (!user && authRoutes.includes(location.pathname)) {
      navigate('/login')
    }

    if (user && publicRoutes.includes(location.pathname)) {
      navigate('/')
    }
  }, [user, location, navigate])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
