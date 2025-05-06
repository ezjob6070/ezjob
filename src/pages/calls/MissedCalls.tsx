
import React from "react";
import { Navigate } from "react-router-dom";

const MissedCalls = () => {
  // Redirect to the main calls page with the not_answered tab selected
  return <Navigate to="/calls" replace state={{ activeTab: "not_answered" }} />;
};

export default MissedCalls;
