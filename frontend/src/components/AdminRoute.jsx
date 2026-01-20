import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute - Wraps routes that require admin privileges
 * 
 * Role-based access:
 * - SYSTEM_ADMIN: Can access all admin routes (/admin/*)
 * - WEBSITE_ADMIN: Can access /admin/website/* only
 * - USER: No admin access
 */
const AdminRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const userRole = user?.role;
  const isSystemAdmin = userRole === "SYSTEM_ADMIN";
  const isWebsiteAdmin = userRole === "WEBSITE_ADMIN";
  const isAdmin = isSystemAdmin || isWebsiteAdmin;

  // Check if user has any admin role
  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        state={{ error: "You don't have permission to access this page." }}
        replace
      />
    );
  }

  // Check specific role requirements
  if (requiredRole) {
    if (requiredRole === "SYSTEM_ADMIN" && !isSystemAdmin) {
      return (
        <Navigate
          to="/admin"
          state={{ error: "You don't have permission to access System Admin." }}
          replace
        />
      );
    }
  }

  // Path-based access control
  const path = location.pathname;

  // WEBSITE_ADMIN trying to access system routes
  if (isWebsiteAdmin && !isSystemAdmin) {
    if (path.startsWith("/admin/system")) {
      return (
        <Navigate
          to="/admin/website"
          state={{ error: "You don't have permission to access System Admin." }}
          replace
        />
      );
    }
  }

  // Render admin content
  return children;
};

export default AdminRoute;
