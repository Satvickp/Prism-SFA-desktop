import React from "react";
import { Navigate } from "react-router-dom";
import { useIsManager, useIsSuperAdmin } from "../../helper/isManager";

const ProtectedRoute = ({ element }) => {
  const isManager = useIsManager();
  const isSuperAdmin = useIsSuperAdmin();
  if (!isManager && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
