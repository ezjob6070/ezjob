
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Technician } from '@/types/technician';
import { technicians as initialTechnicians } from '@/data/technicians';

interface GlobalStateContextType {
  technicians: Technician[];
  addTechnician: (technician: Technician) => void;
  updateTechnician: (technician: Technician) => void;
  deleteTechnician: (id: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);

  const addTechnician = (technician: Technician) => {
    setTechnicians(prev => [technician, ...prev]);
  };

  const updateTechnician = (technician: Technician) => {
    setTechnicians(prev => 
      prev.map(t => t.id === technician.id ? technician : t)
    );
  };

  const deleteTechnician = (id: string) => {
    setTechnicians(prev => prev.filter(t => t.id !== id));
  };

  return (
    <GlobalStateContext.Provider value={{ 
      technicians, 
      addTechnician, 
      updateTechnician, 
      deleteTechnician 
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
