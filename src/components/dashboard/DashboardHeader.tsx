
import React from 'react';
import { PanelsTopLeft, ChartBarIcon, BarChart3Icon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTabChange('dashboard')}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          <PanelsTopLeft className="h-3.5 w-3.5" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === 'statistics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTabChange('statistics')}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          <ChartBarIcon className="h-3.5 w-3.5" />
          Statistics
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTabChange('analytics')}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          <BarChart3Icon className="h-3.5 w-3.5" />
          Analytics
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
