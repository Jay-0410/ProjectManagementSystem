import { Navigate, Route, Routes } from "react-router-dom"
import { Button } from "./components/ui/button"
import Home from "./pages/Home/Home"
import Navbar from "./pages/Navbar/Navbar"
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails"
import Details from "./pages/ProjectDetails/Details/Details"
import Tasks from "./pages/ProjectDetails/Tasks/Tasks"
import TeamMembers from "./pages/ProjectDetails/TeamMembers/TeamMembers"
import ShowTask from "./pages/ProjectDetails/Tasks/showTask/showTask"
import Auth from "./pages/Auth/Auth"
import InvitationAccept from "./pages/InvitationAccept/InvitationAccept"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./context/AuthContext"
import { Toaster } from "react-hot-toast" // Import toast provider
import { FilterProvider } from "./context/FilterContext" // Import filter context

// Import auth debugging utilities (for development)
import './utils/authDebug';
import './utils/taskDebug'; // Import task debugging utilities
import './services/authService';

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
        <Route 
          path="/accept-invitation" 
          element={
            <ProtectedRoute>
              <InvitationAccept />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={
          <ProtectedRoute>
            <FilterProvider>
              <Navbar />
              <Home />
            </FilterProvider>
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId" element={
          <ProtectedRoute>
            <Navbar />
            <ProjectDetails />
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId/task/:taskId" element={
          <ProtectedRoute>
            <Navbar />
            <ShowTask />
          </ProtectedRoute>
        } />
        {/* Redirect any other routes to home if authenticated, auth if not */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated() ? "/" : "/auth"} replace />} 
        />
      </Routes>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </>
  )
}

export default App
