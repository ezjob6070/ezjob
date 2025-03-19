
import { TechniciansFinance } from "@/components/technicians/TechniciansFinance";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { useFinanceData } from "@/hooks/useFinanceData";

const TechnicianFinance = () => {
  const { technicians } = useTechniciansData();
  const { transactions } = useFinanceData();
  
  return (
    <div>
      <TechniciansFinance 
        technicians={technicians} 
        transactions={transactions}
      />
    </div>
  );
};

export default TechnicianFinance;
