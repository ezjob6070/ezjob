
import React, { useState } from "react";
import { useJobsContext } from "../context/JobsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "../JobTypes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CustomFilter {
  name: string;
  conditions: FilterCondition[];
}

interface FilterCondition {
  field: string;
  operator: string;
  value: string | number | boolean;
}

const CustomFilterDialogContent = () => {
  const { jobs } = useJobsContext();
  
  // Available fields to filter on
  const filterFields = [
    { id: "clientName", label: "Client Name" },
    { id: "technicianName", label: "Technician" },
    { id: "contractorName", label: "Contractor" },
    { id: "jobSourceName", label: "Job Source" },
    { id: "amount", label: "Amount ($)" },
    { id: "status", label: "Status" },
    { id: "serviceType", label: "Service Type" },
    { id: "paymentMethod", label: "Payment Method" },
  ];
  
  // Get unique values for each field from available jobs
  const uniqueTechnicians = [...new Set(jobs.map(job => job.technicianName).filter(Boolean))];
  const uniqueContractors = [...new Set(jobs.map(job => job.contractorName).filter(Boolean))];
  const uniqueJobSources = [...new Set(jobs.map(job => job.jobSourceName).filter(Boolean))];
  const uniqueServiceTypes = [...new Set(jobs.map(job => job.serviceType).filter(Boolean))];
  const uniqueStatuses = [...new Set(jobs.map(job => job.status))];
  
  // State for conditions
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { field: "clientName", operator: "contains", value: "" }
  ]);
  
  // State for saved filters
  const [savedFilters, setSavedFilters] = useState<CustomFilter[]>([]);
  const [currentFilterName, setCurrentFilterName] = useState<string>("");
  
  const addCondition = () => {
    setConditions([...conditions, { field: "clientName", operator: "contains", value: "" }]);
  };
  
  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };
  
  const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    ));
  };
  
  const getOperatorOptions = (fieldType: string) => {
    switch (fieldType) {
      case "amount":
        return [
          { value: "equals", label: "Equals (=)" },
          { value: "greaterThan", label: "Greater Than (>)" },
          { value: "lessThan", label: "Less Than (<)" },
          { value: "between", label: "Between" }
        ];
      case "clientName":
      case "technicianName":
      case "contractorName":
      case "jobSourceName":
      case "serviceType":
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
          { value: "startsWith", label: "Starts With" },
          { value: "endsWith", label: "Ends With" }
        ];
      case "status":
      case "paymentMethod":
        return [
          { value: "equals", label: "Is" },
          { value: "notEquals", label: "Is Not" }
        ];
      default:
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" }
        ];
    }
  };
  
  const getValueInput = (condition: FilterCondition, index: number) => {
    switch (condition.field) {
      case "technicianName":
        return (
          <Select 
            value={condition.value as string}
            onValueChange={(value) => updateCondition(index, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {uniqueTechnicians.map(tech => (
                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "contractorName":
        return (
          <Select 
            value={condition.value as string}
            onValueChange={(value) => updateCondition(index, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select contractor" />
            </SelectTrigger>
            <SelectContent>
              {uniqueContractors.map(contractor => (
                <SelectItem key={contractor} value={contractor}>{contractor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "jobSourceName":
        return (
          <Select 
            value={condition.value as string}
            onValueChange={(value) => updateCondition(index, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select job source" />
            </SelectTrigger>
            <SelectContent>
              {uniqueJobSources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "serviceType":
        return (
          <Select 
            value={condition.value as string}
            onValueChange={(value) => updateCondition(index, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {uniqueServiceTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "status":
        return (
          <Select 
            value={condition.value as string}
            onValueChange={(value) => updateCondition(index, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "paymentMethod":
        return (
          <RadioGroup
            value={condition.value as string || ""}
            onValueChange={(value) => updateCondition(index, { value })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id={`cash-${index}`} />
              <Label htmlFor={`cash-${index}`}>Cash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id={`credit-${index}`} />
              <Label htmlFor={`credit-${index}`}>Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="check" id={`check-${index}`} />
              <Label htmlFor={`check-${index}`}>Check</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_transfer" id={`bank-${index}`} />
              <Label htmlFor={`bank-${index}`}>Bank Transfer</Label>
            </div>
          </RadioGroup>
        );
        
      case "amount":
        if (condition.operator === "between") {
          return (
            <div className="flex items-center gap-2">
              <Input 
                type="number"
                placeholder="Min"
                className="w-full"
                value={(condition.value as any)?.min || ""}
                onChange={(e) => updateCondition(index, { 
                  value: { 
                    min: parseFloat(e.target.value),
                    max: (condition.value as any)?.max
                  } 
                })}
              />
              <span>to</span>
              <Input 
                type="number"
                placeholder="Max"
                className="w-full"
                value={(condition.value as any)?.max || ""}
                onChange={(e) => updateCondition(index, { 
                  value: { 
                    min: (condition.value as any)?.min,
                    max: parseFloat(e.target.value)
                  } 
                })}
              />
            </div>
          );
        } else {
          return (
            <Input 
              type="number"
              placeholder="Enter amount"
              value={condition.value as number || ""}
              onChange={(e) => updateCondition(index, { value: parseFloat(e.target.value) })}
            />
          );
        }
        
      default:
        return (
          <Input 
            placeholder="Enter value"
            value={condition.value as string || ""}
            onChange={(e) => updateCondition(index, { value: e.target.value })}
          />
        );
    }
  };
  
  const saveCurrentFilter = () => {
    if (!currentFilterName.trim()) {
      toast({
        title: "Filter Name Required",
        description: "Please enter a name for your custom filter",
        variant: "destructive",
      });
      return;
    }
    
    setSavedFilters([
      ...savedFilters,
      { name: currentFilterName, conditions: [...conditions] }
    ]);
    
    toast({
      title: "Filter Saved",
      description: `"${currentFilterName}" filter has been saved`,
    });
    
    setCurrentFilterName("");
  };
  
  const applyFilter = () => {
    console.log("Applying filter with conditions:", conditions);
    
    // Here we would apply the filter logic
    // For now, just show a success toast
    toast({
      title: "Filter Applied",
      description: `Filter with ${conditions.length} condition${conditions.length !== 1 ? 's' : ''} has been applied`,
    });
  };
  
  const exportFilters = () => {
    const dataStr = JSON.stringify(savedFilters, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `job-filters-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Filter Conditions</h3>
        {conditions.map((condition, index) => (
          <div key={index} className="space-y-2 border p-3 rounded-md bg-muted/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Select 
                value={condition.field}
                onValueChange={(value) => updateCondition(index, { field: value, value: "" })}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {filterFields.map(field => (
                    <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={condition.operator}
                onValueChange={(value) => updateCondition(index, { operator: value })}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {getOperatorOptions(condition.field).map(op => (
                    <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="w-full min-w-[200px]">
                {getValueInput(condition, index)}
              </div>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => removeCondition(index)}
                className="sm:self-start"
                disabled={conditions.length === 1}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={addCondition}
          className="w-full mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Save This Filter</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Filter name"
            value={currentFilterName}
            onChange={(e) => setCurrentFilterName(e.target.value)}
          />
          <Button onClick={saveCurrentFilter}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      {savedFilters.length > 0 && (
        <>
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Saved Filters</h3>
              <Button variant="outline" size="sm" onClick={exportFilters}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedFilters.map((filter, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-md cursor-pointer hover:bg-accent/50"
                  onClick={() => {
                    setConditions(filter.conditions);
                    setCurrentFilterName(filter.name);
                  }}
                >
                  <div className="font-medium">{filter.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {filter.conditions.length} condition{filter.conditions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button onClick={applyFilter}>
          Apply Filter
        </Button>
      </div>
    </div>
  );
};

export default CustomFilterDialogContent;
