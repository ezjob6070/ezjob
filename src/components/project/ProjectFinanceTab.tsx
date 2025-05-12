
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CircleDollarSign, Receipt } from "lucide-react";
import InvoiceQuoteTab from "./InvoiceQuoteTab";

interface ProjectFinanceTabProps {
  project: Project;
}

const ProjectFinanceTab: React.FC<ProjectFinanceTabProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(project.budget)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Spent So Far
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(project.actualSpent)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((project.actualSpent / project.budget) * 100)}% of budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Remaining Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.max(0, project.budget - project.actualSpent))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="invoices-quotes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="invoices-quotes" className="flex items-center gap-1">
            <Receipt className="h-4 w-4" />
            Invoices & Quotes
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-1">
            <CircleDollarSign className="h-4 w-4" />
            Expenses
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices-quotes">
          <InvoiceQuoteTab project={project} />
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="space-y-6">
            {/* Expenses Section */}
            <Card>
              <CardHeader>
                <CardTitle>Project Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {project.expenses && project.expenses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div>Description</div>
                      <div>Date</div>
                      <div>Category</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Status</div>
                    </div>
                    
                    {project.expenses.map((expense) => (
                      <div key={expense.id} className="grid grid-cols-5 text-sm py-2 border-b border-b-gray-100">
                        <div className="font-medium">{expense.name}</div>
                        <div>{expense.date}</div>
                        <div>{expense.category}</div>
                        <div className="text-right">{formatCurrency(expense.amount)}</div>
                        <div className="text-right">
                          <span 
                            className={`
                              inline-block px-2 py-1 rounded-md text-xs font-medium
                              ${expense.status === 'paid' ? 'bg-green-100 text-green-800' :
                                expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                            `}
                          >
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Total Expenses:</span>
                        <span className="ml-2 font-bold">
                          {formatCurrency(
                            project.expenses.reduce((sum, exp) => sum + exp.amount, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No expenses recorded for this project</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Contractors Costs */}
            {project.contractors && project.contractors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contractor Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div>Contractor</div>
                      <div>Role</div>
                      <div>Rate</div>
                      <div className="text-right">Hours</div>
                      <div className="text-right">Total Paid</div>
                    </div>
                    
                    {project.contractors.map((contractor) => (
                      <div key={contractor.id} className="grid grid-cols-5 text-sm py-2 border-b border-b-gray-100">
                        <div className="font-medium">{contractor.name}</div>
                        <div>{contractor.role}</div>
                        <div>${contractor.rate}/{contractor.rateType}</div>
                        <div className="text-right">{contractor.hoursWorked || "N/A"}</div>
                        <div className="text-right font-medium">{formatCurrency(contractor.totalPaid)}</div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Total Contractor Costs:</span>
                        <span className="ml-2 font-bold">
                          {formatCurrency(
                            project.contractors.reduce((sum, contractor) => sum + contractor.totalPaid, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Materials Costs */}
            {project.materials && project.materials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div>Material</div>
                      <div>Quantity</div>
                      <div>Unit Price</div>
                      <div>Purchase Date</div>
                      <div className="text-right">Total Cost</div>
                    </div>
                    
                    {project.materials.map((material) => (
                      <div key={material.id} className="grid grid-cols-5 text-sm py-2 border-b border-b-gray-100">
                        <div className="font-medium">{material.name}</div>
                        <div>{material.quantity}</div>
                        <div>{formatCurrency(material.unitPrice)}</div>
                        <div>{material.purchaseDate}</div>
                        <div className="text-right font-medium">{formatCurrency(material.totalPrice)}</div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Total Material Costs:</span>
                        <span className="ml-2 font-bold">
                          {formatCurrency(
                            project.materials.reduce((sum, material) => sum + material.totalPrice, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Equipment Costs */}
            {project.equipment && project.equipment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div>Equipment</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div>Duration</div>
                      <div className="text-right">Total Cost</div>
                    </div>
                    
                    {project.equipment.map((equipment) => (
                      <div key={equipment.id} className="grid grid-cols-5 text-sm py-2 border-b border-b-gray-100">
                        <div className="font-medium">{equipment.name}</div>
                        <div>{equipment.type}</div>
                        <div>
                          <span 
                            className={`
                              inline-block px-2 py-1 rounded-md text-xs font-medium
                              ${equipment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                equipment.status === 'returned' ? 'bg-green-100 text-green-800' : 
                                'bg-purple-100 text-purple-800'}
                            `}
                          >
                            {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                          </span>
                        </div>
                        <div>
                          {equipment.startDate && equipment.endDate 
                            ? `${equipment.startDate} - ${equipment.endDate}` 
                            : equipment.startDate || 'N/A'
                          }
                        </div>
                        <div className="text-right font-medium">{formatCurrency(equipment.totalCost)}</div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Total Equipment Costs:</span>
                        <span className="ml-2 font-bold">
                          {formatCurrency(
                            project.equipment.reduce((sum, equipment) => sum + equipment.totalCost, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Salesman Commissions */}
            {project.salesmen && project.salesmen.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Salesperson Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div>Salesperson</div>
                      <div>Sales Value</div>
                      <div>Commission Rate</div>
                      <div className="text-right">Total Commission</div>
                    </div>
                    
                    {project.salesmen.map((salesperson) => (
                      <div key={salesperson.id} className="grid grid-cols-4 text-sm py-2 border-b border-b-gray-100">
                        <div className="font-medium">{salesperson.name}</div>
                        <div>{formatCurrency(salesperson.totalSales)}</div>
                        <div>
                          {salesperson.commissionType === "percentage" 
                            ? `${salesperson.commission}%` 
                            : formatCurrency(salesperson.commission)
                          }
                        </div>
                        <div className="text-right font-medium">{formatCurrency(salesperson.totalCommission)}</div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Total Commission Costs:</span>
                        <span className="ml-2 font-bold">
                          {formatCurrency(
                            project.salesmen.reduce((sum, salesman) => sum + salesman.totalCommission, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectFinanceTab;
