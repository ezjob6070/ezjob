
import React from "react";
import { Navigate } from "react-router-dom";

const ConvertedCalls = () => {
  // Redirect to the main calls page with the converted tab selected
  return <Navigate to="/calls" replace state={{ activeTab: "converted" }} />;
};

export default ConvertedCalls;
