import { Navigate, Route, Routes } from "react-router-dom"
import { Button } from "./components/ui/button"
import Home from "./pages/Home/Home"
import Navbar from "./pages/Navbar/Navbar"
import Footer from "./pages/Footer/Footer"
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails"
import Details from "./pages/ProjectDetails/Details/Details"
import Tasks from "./pages/ProjectDetails/Tasks/Tasks"
import TeamMembers from "./pages/ProjectDetails/TeamMembers/TeamMembers"
import ShowTask from "./pages/ProjectDetails/Tasks/showTask/showTask"
import Auth from "./pages/Auth/Auth"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./context/AuthContext"

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route 
          path="/auth" 
          element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Auth />
          } 
        />
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <Home />
            <Footer />
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId" element={
          <ProtectedRoute>
            <Navbar />
            <ProjectDetails />
            <Footer />
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId/task/:taskId" element={
          <ProtectedRoute>
            <Navbar />
            <ShowTask />
            <Footer />
          </ProtectedRoute>
        } />
        {/* Redirect any other routes to home if authenticated, auth if not */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated() ? "/" : "/auth"} replace />} 
        />
      </Routes>
    </>
  )
}

export default App
