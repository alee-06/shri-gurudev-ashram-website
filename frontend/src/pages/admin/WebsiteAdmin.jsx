import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WebsiteAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to gallery manager by default
    navigate("/admin/website/gallery", { replace: true });
  }, [navigate]);

  return null;
};

export default WebsiteAdmin;
