
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCardIcon, DollarSignIcon, FileTextIcon, CheckCircleIcon } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import PaymentForm from "@/components/payments/PaymentForm";
import TransactionHistory from "@/components/payments/TransactionHistory";

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
      status: "completed" 
    },
    { 
      id: "tx2", 
      date: new Date("2023-09-10"), 
      amount: 750, 
      client: "Tech Solutions Inc.", 
      job: "Network Setup",
      status: "completed" 
    },
    { 
      id: "tx3", 
      date: new Date("2023-09-05"), 
      amount: 500, 
      client: "Global Industries", 
      job: "Security System Install",
      status: "pending" 
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Payments & Transactions
        </h1>
        <p className="text-muted-foreground mt-1">
          Process payments, create estimates, and view transaction history
        </p>
      </div>

      <Tabs defaultValue="process" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="process">Process Payment</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
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

        <TabsContent value="estimates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5 text-blue-600" />
                <span>Create Estimate</span>
              </CardTitle>
              <CardDescription>
                Create and send job estimates to clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estimate-client">Client</Label>
                  <select 
                    id="estimate-client"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="" disabled selected>Select a client</option>
                    <option value="client1">Acme Corp</option>
                    <option value="client2">Tech Solutions Inc.</option>
                    <option value="client3">Global Industries</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimate-title">Job Title</Label>
                  <Input id="estimate-title" placeholder="HVAC Maintenance" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimate-amount">Estimated Amount</Label>
                  <Input id="estimate-amount" placeholder="0.00" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimate-description">Description</Label>
                  <Input id="estimate-description" placeholder="Job details and scope" />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                  onClick={() => {
                    toast({
                      title: "Estimate Created",
                      description: "The estimate has been sent to the client.",
                    });
                  }}
                >
                  Create & Send Estimate
                </Button>
              </div>
            </CardContent>
          </Card>
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
