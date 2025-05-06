
import React from "react";
import { Navigate } from "react-router-dom";

const MissedCalls = () => {
  // Redirect to the main calls page with the missed tab selected
  return <Navigate to="/calls" replace state={{ activeTab: "missed" }} />;
};

export default MissedCalls;
