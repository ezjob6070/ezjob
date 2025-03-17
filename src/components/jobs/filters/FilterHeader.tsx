
import React from 'react';

interface FilterHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const FilterHeader = ({ title, children }: FilterHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-medium">{title}</h3>
      {children}
    </div>
  );
};

export default FilterHeader;
