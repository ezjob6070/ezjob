
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Estimate, EstimateStatus } from "@/types/estimate";
import { format } from "date-fns";
import { CheckCircleIcon, ClockIcon, MailIcon, PhoneIcon, SendIcon } from "lucide-react";

interface EstimateCardProps {
  estimate: Estimate;
  onStatusChange: (id: string, status: EstimateStatus) => void;
}

const EstimateCard = ({ estimate, onStatusChange }: EstimateCardProps) => {
  const handleStatusChange = (status: EstimateStatus) => {
    onStatusChange(estimate.id, status);
  };

  const statusIcons = {
    "sent": <SendIcon className="h-4 w-4 text-blue-500" />,
    "in-process": <ClockIcon className="h-4 w-4 text-yellow-500" />,
    "completed": <CheckCircleIcon className="h-4 w-4 text-green-500" />
  };

  const statusText = {
    "sent": "Sent",
    "in-process": "In Process",
    "completed": "Completed"
  };
  
  const totalAmount = estimate.price * (1 + (estimate.tax / 100));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{estimate.clientName}</CardTitle>
          <div className="flex items-center gap-1 text-sm">
            {statusIcons[estimate.status]}
            <span>{statusText[estimate.status]}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{estimate.clientEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{estimate.clientPhone}</span>
          </div>
          <div className="mt-4">
            <div className="font-medium">Description</div>
            <p className="text-muted-foreground">{estimate.description}</p>
          </div>
          <div className="mt-2">
            <div className="flex justify-between">
              <span>Price</span>
              <span>{formatCurrency(estimate.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({estimate.tax}%)</span>
              <span>{formatCurrency(estimate.price * (estimate.tax / 100))}</span>
            </div>
            <div className="flex justify-between font-semibold mt-1">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          Created: {format(estimate.createdAt, "MMM d, yyyy")}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">View Details</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Estimate Details</DialogTitle>
              <DialogDescription>
                View and update the estimate for {estimate.clientName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <div className="font-medium">Client Information</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Name</div>
                    <div>{estimate.clientName}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Email</div>
                    <div>{estimate.clientEmail}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone</div>
                    <div>{estimate.clientPhone}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Address</div>
                    <div>{estimate.clientAddress}</div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Job Details</div>
                <div>
                  <div className="text-muted-foreground">Description</div>
                  <div>{estimate.description}</div>
                </div>
                {estimate.images.length > 0 && (
                  <div>
                    <div className="text-muted-foreground">Images</div>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {estimate.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Job image ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Financial Details</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div>{formatCurrency(estimate.price)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Tax</div>
                    <div>{estimate.tax}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total</div>
                    <div className="font-semibold">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Status</div>
                <Select
                  value={estimate.status}
                  onValueChange={(value) => handleStatusChange(value as EstimateStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="in-process">In Process</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Send Email
              </Button>
              <Button size="sm">
                Print
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default EstimateCard;
