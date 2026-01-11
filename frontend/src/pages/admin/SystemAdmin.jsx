import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SystemAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to overview by default
    navigate("/admin/system/overview", { replace: true });
  }, [navigate]);

  return null;
};

export default SystemAdmin;
