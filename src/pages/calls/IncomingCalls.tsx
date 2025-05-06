
import React from "react";
import { Navigate } from "react-router-dom";

const IncomingCalls = () => {
  // Redirect to the main calls page with the incoming tab selected
  return <Navigate to="/calls" replace state={{ activeTab: "incoming" }} />;
};

export default IncomingCalls;
