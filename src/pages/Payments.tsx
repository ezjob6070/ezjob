
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCardIcon, DollarSignIcon, FileTextIcon, CheckCircleIcon, ReceiptIcon, PhoneIcon } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import PaymentForm from "@/components/payments/PaymentForm";
import TransactionHistory from "@/components/payments/TransactionHistory";
import InvoiceForm from "@/components/payments/InvoiceForm";
import InvoiceList from "@/components/payments/InvoiceList";

const Payments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("process");

  // Mock data for demonstration
  const transactions = [
    { 
      id: "tx1", 
      date: new Date("2023-09-15"), 
      amount: 1250, 
      client: "Acme Corp", 
      job: "HVAC Installation",
      status: "completed",
      technician: "John Smith"
    },
    { 
      id: "tx2", 
      date: new Date("2023-09-10"), 
      amount: 750, 
      client: "Tech Solutions Inc.", 
      job: "Network Setup",
      status: "completed",
      technician: "Maria Rodriguez"
    },
    { 
      id: "tx3", 
      date: new Date("2023-09-05"), 
      amount: 500, 
      client: "Global Industries", 
      job: "Security System Install",
      status: "pending",
      technician: "John Smith"
    },
    { 
      id: "tx4", 
      date: new Date("2023-10-05"), 
      amount: 800, 
      client: "Metro Hospital", 
      job: "Medical Equipment Setup",
      status: "completed",
      technician: "Sarah Johnson"
    },
    { 
      id: "tx5", 
      date: new Date("2023-10-12"), 
      amount: 350, 
      client: "Downtown Restaurant", 
      job: "Kitchen Repair",
      status: "pending",
      technician: "David Williams"
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Payments & Invoices
        </h1>
        <p className="text-muted-foreground mt-1">
          Process payments, create invoices, and view transaction history
        </p>
      </div>

      <Tabs defaultValue="process" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="process">Process Payment</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5 text-blue-600" />
                  <span>Process Payment</span>
                </CardTitle>
                <CardDescription>
                  Collect payment from a customer for a completed job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSignIcon className="h-5 w-5 text-green-600" />
                  <span>Quick Payment</span>
                </CardTitle>
                <CardDescription>
                  Send a payment link directly to the customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Customer Email</Label>
                    <Input id="customer-email" placeholder="customer@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">
                      <span className="flex items-center gap-1">
                        <PhoneIcon size={16} />
                        Customer Phone
                      </span>
                    </Label>
                    <Input id="customer-phone" placeholder="(555) 123-4567" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Amount</Label>
                    <Input id="payment-amount" placeholder="0.00" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-description">Description</Label>
                    <Input id="payment-description" placeholder="Service Description" />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                    onClick={() => {
                      toast({
                        title: "Payment Link Sent",
                        description: "The customer will receive an email with payment instructions."
                      });
                    }}
                  >
                    Send Payment Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory transactions={transactions} formatCurrency={formatCurrency} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-blue-600" />
                  <span>Create Invoice</span>
                </CardTitle>
                <CardDescription>
                  Create and send professional invoices to clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ReceiptIcon className="h-5 w-5 text-purple-600" />
                  <span>Recent Invoices</span>
                </CardTitle>
                <CardDescription>
                  View and manage recent invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and Stripe integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-md bg-green-50">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Stripe Integration Active</span>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex gap-2 bg-gray-50">
                      <CreditCardIcon className="h-4 w-4" />
                      Credit Card
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      <DollarSignIcon className="h-4 w-4" />
                      Bank Transfer
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      + Add Method
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
