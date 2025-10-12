// router/RouteWrapper.jsx
import { useEffect } from "react";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function RouteWrapper({ children, protect = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken(); // This will remove expired token automatically

    if (protect && !token) {
      // Only redirect if the route is protected and token is missing/expired
      navigate("/login", { replace: true });
    }
  }, [navigate, protect]);

  return children;
}
