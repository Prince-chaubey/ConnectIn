import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first !");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;