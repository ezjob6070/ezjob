
import TechniciansFinance from "@/components/technicians/TechniciansFinance";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { useFinanceData } from "@/hooks/useFinanceData";

const TechnicianFinance = () => {
  const { technicians } = useTechniciansData();
  const { transactions } = useFinanceData();
  
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <TechniciansFinance 
        technicians={technicians} 
        transactions={transactions}
      />
    </div>
  );
};

export default TechnicianFinance;
