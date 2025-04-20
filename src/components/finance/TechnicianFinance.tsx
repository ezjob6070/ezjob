
import TechniciansFinance from "@/components/technicians/TechniciansFinance";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { useFinanceData } from "@/hooks/useFinanceData";
import { Card, CardContent } from "@/components/ui/card";

const TechnicianFinance = () => {
  const { filteredTechnicians } = useTechniciansData();
  const { transactions } = useFinanceData();
  
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <TechniciansFinance 
          technicians={filteredTechnicians} 
          transactions={transactions}
        />
      </CardContent>
    </Card>
  );
};

export default TechnicianFinance;
