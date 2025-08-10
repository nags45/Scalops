import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Link from "./components/Link.jsx";
import Home from "./components/Home.jsx";
import GoogleCallback from "./components/GoogleCallback.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/link" element={<Link />} />
        <Route path="/home" element={<Home />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
