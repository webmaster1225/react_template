import React from "react";
import appConfig from "../../config/appConfig";
import { REDIRECT_URL_KEY } from "../../config/constant";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../utils/hooks/useAuth";

const { unAuthenticatedEntryPath } = appConfig;

const ProtectedRoute = () => {
  const { authenticated } = useAuth();

  const location = useLocation();

  if (!authenticated) {
    return (
      <Navigate
        to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
