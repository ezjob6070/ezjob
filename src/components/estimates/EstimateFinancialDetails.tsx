
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface EstimateFinancialDetailsProps {
  price: number;
  tax: number;
  detailed?: boolean;
}

const EstimateFinancialDetails = ({ price, tax, detailed = false }: EstimateFinancialDetailsProps) => {
  const taxAmount = price * (tax / 100);
  const totalAmount = price + taxAmount;

  return (
    <div className={detailed ? "grid gap-2" : "mt-2"}>
      {detailed && <div className="font-medium">Financial Details</div>}
      <div className={detailed ? "grid grid-cols-2 gap-2 text-sm" : ""}>
        <div className="flex justify-between">
          <span>{detailed ? <div className="text-muted-foreground">Price</div> : "Price"}</span>
          <span>{formatCurrency(price)}</span>
        </div>
        <div className="flex justify-between">
          <span>{detailed ? <div className="text-muted-foreground">Tax</div> : `Tax (${tax}%)`}</span>
          <span>{detailed ? `${tax}%` : formatCurrency(taxAmount)}</span>
        </div>
        <div className={`flex justify-between ${!detailed ? "font-semibold mt-1" : ""}`}>
          <span>{detailed ? <div className="text-muted-foreground">Total</div> : "Total"}</span>
          <span className={detailed ? "font-semibold" : ""}>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default EstimateFinancialDetails;
