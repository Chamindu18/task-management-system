import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from "./pages/HomePage"; 
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import TaskPage from "./pages/TaskPage";
import TaskDetails from "./pages/TaskDetails";
import Profile from "./components/profile/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from './routes/ProtectedRoute';
import AdminPage from './pages/AdminPage';  

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* HOMEPAGE ROUTE */}
          <Route path="/" element={<HomePage />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tasks/:id" 
            element={
              <ProtectedRoute>
                <TaskDetails />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* ADMIN ROUTES */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;