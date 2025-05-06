
import React from "react";
import { Navigate } from "react-router-dom";

const OutgoingCalls = () => {
  // Redirect to the main calls page with the outgoing tab selected
  return <Navigate to="/calls" replace state={{ activeTab: "outgoing" }} />;
};

export default OutgoingCalls;
