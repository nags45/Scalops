import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from './contexts/UserContext';
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Link from "./components/Link.jsx";
import Home from "./components/Home.jsx";
import GoogleCallback from "./components/GoogleCallback.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useUser } from './contexts/UserContext';

const AuthGuard = ({ children }) => {
  const { user } = useUser();
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={
            <AuthGuard>
              <LoginForm />
            </AuthGuard>
          } />
          <Route path="/register" element={
            <AuthGuard>
              <RegisterForm />
            </AuthGuard>
          } />
          <Route path="/google/callback" element={<GoogleCallback />} />
          
          <Route path="/link" element={
            <ProtectedRoute>
              <Link />
            </ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;