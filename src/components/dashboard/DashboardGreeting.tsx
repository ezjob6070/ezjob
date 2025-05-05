
import React from "react";

interface DashboardGreetingProps {
  name: string;
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ name }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hello, {name}</h1>
      <p className="text-muted-foreground">Welcome to your Easy Job dashboard</p>
    </div>
  );
};

export default DashboardGreeting;
