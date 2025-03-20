import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/Dashboard";
import MessageForm from "./components/MessagesForm";
import Login from "./components/Login";
import "react-toastify/dist/ReactToastify.css";
import ForgetPass from "./components/ForgetPass";

const PrivateRoute = ({ element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/" />;
};

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forget-password" element={<ForgetPass/>} />
        <Route path="/user/:userId" element={<MessageForm />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} /></>
  );
}

export default App;
