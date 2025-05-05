
import React from "react";

interface DashboardGreetingProps {
  name: string;
  subtitle?: string;
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ name, subtitle }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hello, {name}</h1>
      <p className="text-muted-foreground">{subtitle || "Welcome to your Easy Job dashboard"}</p>
    </div>
  );
};

export default DashboardGreeting;
