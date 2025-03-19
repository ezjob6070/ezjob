
import TechniciansFinance from "@/components/technicians/TechniciansFinance";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { useFinanceData } from "@/hooks/useFinanceData";
import { Card, CardContent } from "@/components/ui/card";

const TechnicianFinance = () => {
  const { technicians } = useTechniciansData();
  const { transactions } = useFinanceData();
  
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <TechniciansFinance 
          technicians={technicians} 
          transactions={transactions}
        />
      </CardContent>
    </Card>
  );
};

export default TechnicianFinance;
