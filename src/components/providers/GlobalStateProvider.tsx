
import React, { createContext, useState, useContext, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface GlobalStateContextProps {
  currentIndustry: string;
  setCurrentIndustry: (industry: string) => void;
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndustry, setCurrentIndustry] = useState("service");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [serviceCategory, setServiceCategory] = useState("All Services");

  return (
    <GlobalStateContext.Provider value={{
      currentIndustry,
      setCurrentIndustry,
      dateFilter,
      setDateFilter,
      serviceCategory,
      setServiceCategory
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
