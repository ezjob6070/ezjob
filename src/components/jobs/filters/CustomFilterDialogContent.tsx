import React from 'react';
import { RangeValue } from '@/components/ui/date-range-picker';
import { useJobsContext } from "../context/JobsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "../JobTypes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, Save, Search, AlertTriangle, CalendarIcon, Clock, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface CustomFilter {
  name: string;
  conditions: FilterCondition[];
}

interface FilterCondition {
  field: string;
  operator: string;
  value: string | number | boolean | RangeValue | Date;
  conjunction?: "AND" | "OR";
}

interface RangeValue {
  min: number;
  max: number;
}

const CustomFilterDialogContent = () => {
  const { jobs } = useJobsContext();
  
  // Available fields to filter on
  const filterFields = [
    { id: "clientName", label: "Client Name", type: "text" },
    { id: "technicianName", label: "Technician", type: "select" },
    { id: "contractorName", label: "Contractor", type: "select" },
    { id: "jobSourceName", label: "Job Source", type: "select" },
    { id: "amount", label: "Amount ($)", type: "number" },
    { id: "status", label: "Status", type: "select" },
    { id: "serviceType", label: "Service Type", type: "select" },
    { id: "paymentMethod", label: "Payment Method", type: "radio" },
    { id: "date", label: "Date", type: "date" },
    { id: "notes", label: "Notes", type: "text" },
    { id: "address", label: "Address", type: "text" },
    { id: "isAllDay", label: "All Day Job", type: "boolean" },
    { id: "hasAttachments", label: "Has Attachments", type: "boolean" },
    { id: "isPriority", label: "Priority Job", type: "boolean" },
    { id: "isRecurring", label: "Recurring Job", type: "boolean" }
  ];
  
  // Get unique values for each field from available jobs
  const uniqueTechnicians = [...new Set(jobs.map(job => job.technicianName).filter(Boolean))];
  const uniqueContractors = [...new Set(jobs.map(job => job.contractorName).filter(Boolean))];
  const uniqueJobSources = [...new Set(jobs.map(job => job.jobSourceName).filter(Boolean))];
  const uniqueServiceTypes = [...new Set(jobs.map(job => job.serviceType).filter(Boolean))];
  const uniqueStatuses = [...new Set(jobs.map(job => job.status))];
  const uniqueAddresses = [...new Set(jobs.map(job => job.address).filter(Boolean))];
  
  // State for conditions
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { field: "clientName", operator: "contains", value: "", conjunction: "AND" }
  ]);
  
  // State for saved filters
  const [savedFilters, setSavedFilters] = useState<CustomFilter[]>([]);
  const [currentFilterName, setCurrentFilterName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("build");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState<number | null>(null);
  const [searchSavedFilters, setSearchSavedFilters] = useState<string>("");
  
  const addCondition = () => {
    setConditions([
      ...conditions, 
      { 
        field: "clientName", 
        operator: "contains", 
        value: "", 
        conjunction: conditions.length > 0 ? "AND" : undefined 
      }
    ]);
  };
  
  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };
  
  const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    ));
  };

  const updateConjunction = (index: number, conjunction: "AND" | "OR") => {
    if (index > 0) {
      setConditions(conditions.map((condition, i) => 
        i === index ? { ...condition, conjunction } : condition
      ));
    }
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
      case "date":
        return [
          { value: "equals", label: "Is On" },
          { value: "before", label: "Is Before" },
          { value: "after", label: "Is After" },
          { value: "between", label: "Is Between" }
        ];
      case "clientName":
      case "technicianName":
      case "contractorName":
      case "jobSourceName":
      case "serviceType":
      case "address":
      case "notes":
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
          { value: "startsWith", label: "Starts With" },
          { value: "endsWith", label: "Ends With" },
          { value: "notContains", label: "Does Not Contain" }
        ];
      case "status":
      case "paymentMethod":
        return [
          { value: "equals", label: "Is" },
          { value: "notEquals", label: "Is Not" }
        ];
      case "boolean":
        return [
          { value: "equals", label: "Is" }
        ];
      default:
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" }
        ];
    }
  };
  
  const getValueInput = (condition: FilterCondition, index: number) => {
    const field = filterFields.find(f => f.id === condition.field);
    
    if (!field) return null;
    
    switch (field.type) {
      case "select":
        let options: string[] = [];
        
        switch (field.id) {
          case "technicianName":
            options = uniqueTechnicians;
            break;
          case "contractorName":
            options = uniqueContractors;
            break;
          case "jobSourceName":
            options = uniqueJobSources;
            break;
          case "serviceType":
            options = uniqueServiceTypes;
            break;
          case "status":
            options = uniqueStatuses;
            break;
          case "address":
            options = uniqueAddresses;
            break;
          default:
            options = [];
        }
        
        return (
          <Select 
            value={condition.value as string}
            onValueChange={(value) => updateCondition(index, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case "radio":
        if (field.id === "paymentMethod") {
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
        }
        return null;
        
      case "number":
        if (condition.operator === "between") {
          const rangeValue = condition.value as RangeValue || { min: 0, max: 0 };
          return (
            <div className="flex items-center gap-2">
              <Input 
                type="number"
                placeholder="Min"
                className="w-full"
                value={rangeValue.min || ""}
                onChange={(e) => updateCondition(index, { 
                  value: { 
                    min: parseFloat(e.target.value),
                    max: rangeValue.max
                  } 
                })}
              />
              <span>to</span>
              <Input 
                type="number"
                placeholder="Max"
                className="w-full"
                value={rangeValue.max || ""}
                onChange={(e) => updateCondition(index, { 
                  value: { 
                    min: rangeValue.min,
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

      case "date":
        return (
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {condition.value instanceof Date
                    ? format(condition.value as Date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={condition.value as Date}
                  onSelect={(date) => updateCondition(index, { 
                    value: date as Date 
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {condition.operator === "between" && (
              <>
                <span className="text-center text-xs text-muted-foreground">to</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {(condition.value as any)?.endDate instanceof Date
                        ? format((condition.value as any).endDate as Date, "PPP")
                        : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={(condition.value as any)?.endDate}
                      onSelect={(date) => updateCondition(index, { 
                        value: { 
                          startDate: (condition.value as any)?.startDate || condition.value,
                          endDate: date
                        } 
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        );
      
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={!!condition.value}
              onCheckedChange={(checked) => updateCondition(index, { value: checked })}
              id={`${field.id}-${index}`}
            />
            <Label htmlFor={`${field.id}-${index}`}>
              {checked => (
                <span>{checked ? "Yes" : "No"}</span>
              )}
            </Label>
          </div>
        );
        
      default:
        return (
          <Input 
            placeholder={`Enter ${field.label.toLowerCase()}`}
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
    
    // If we're editing an existing filter
    if (selectedFilterIndex !== null) {
      const updatedFilters = [...savedFilters];
      updatedFilters[selectedFilterIndex] = {
        name: currentFilterName,
        conditions: [...conditions]
      };
      setSavedFilters(updatedFilters);
      
      toast({
        title: "Filter Updated",
        description: `"${currentFilterName}" filter has been updated`,
      });
    } else {
      // Creating a new filter
      setSavedFilters([
        ...savedFilters,
        { name: currentFilterName, conditions: [...conditions] }
      ]);
      
      toast({
        title: "Filter Saved",
        description: `"${currentFilterName}" filter has been saved`,
      });
    }
    
    setCurrentFilterName("");
    setSelectedFilterIndex(null);
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
    
    toast({
      title: "Filters Exported",
      description: `Your filters have been exported to ${exportFileDefaultName}`,
    });
  };

  const importFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedFilters = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedFilters)) {
          setSavedFilters([...savedFilters, ...importedFilters]);
          toast({
            title: "Filters Imported",
            description: `Successfully imported ${importedFilters.length} filters`,
          });
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "The selected file is not a valid filter configuration",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  const deleteFilter = (index: number) => {
    setSavedFilters(savedFilters.filter((_, i) => i !== index));
    if (selectedFilterIndex === index) {
      setSelectedFilterIndex(null);
      setCurrentFilterName("");
    }
  };

  const editFilter = (index: number) => {
    const filter = savedFilters[index];
    setConditions(filter.conditions);
    setCurrentFilterName(filter.name);
    setSelectedFilterIndex(index);
    setActiveTab("build");
  };

  const resetFilter = () => {
    setConditions([{ field: "clientName", operator: "contains", value: "" }]);
    setCurrentFilterName("");
    setSelectedFilterIndex(null);
  };

  const filteredSavedFilters = searchSavedFilters 
    ? savedFilters.filter(filter => 
        filter.name.toLowerCase().includes(searchSavedFilters.toLowerCase()))
    : savedFilters;

  return (
    <div className="space-y-4 py-4 max-h-[80vh] overflow-y-auto">
      <Tabs defaultValue="build" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="build">Build Filter</TabsTrigger>
          <TabsTrigger value="saved">Saved Filters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="build" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Filter Conditions</h3>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? "Hide Advanced" : "Show Advanced"}
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="space-y-3 border p-4 rounded-md bg-muted/20">
                {index > 0 && (
                  <div className="flex items-center mb-2">
                    <Select 
                      value={condition.conjunction}
                      onValueChange={(value) => updateConjunction(index, value as "AND" | "OR")}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="AND" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1 h-px bg-border ml-2"></div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-3">
                    <Label>Field</Label>
                    <Select 
                      value={condition.field}
                      onValueChange={(value) => updateCondition(index, { field: value, value: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterFields.map(field => (
                          <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="lg:col-span-3">
                    <Label>Operator</Label>
                    <Select 
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperatorOptions(filterFields.find(f => f.id === condition.field)?.type || "").map(op => (
                          <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="lg:col-span-5">
                    <Label>Value</Label>
                    {getValueInput(condition, index)}
                  </div>
                  
                  <div className="lg:col-span-1 flex items-end justify-end">
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => removeCondition(index)}
                      disabled={conditions.length === 1}
                      className="h-10 w-10"
                    >
                      <span className="sr-only">Remove</span>
                      &times;
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addCondition}
              className="w-full mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Save This Filter</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Filter name"
                value={currentFilterName}
                onChange={(e) => setCurrentFilterName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveCurrentFilter}>
                <Save className="h-4 w-4 mr-2" />
                {selectedFilterIndex !== null ? 'Update' : 'Save'}
              </Button>
            </div>
            {selectedFilterIndex !== null && (
              <Button variant="outline" onClick={resetFilter} className="w-full">
                Cancel Editing
              </Button>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={resetFilter}>
              Reset
            </Button>
            <Button onClick={applyFilter}>
              Apply Filter
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search saved filters..."
                  className="pl-8"
                  value={searchSavedFilters}
                  onChange={(e) => setSearchSavedFilters(e.target.value)}
                />
              </div>
              <div className="flex gap-2 ml-2">
                <Button variant="outline" size="icon" onClick={exportFilters}>
                  <Download className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    id="import-filters"
                    accept=".json"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={importFilters}
                  />
                  <Button variant="outline" size="icon" asChild>
                    <label htmlFor="import-filters" className="cursor-pointer">
                      <Plus className="h-4 w-4" />
                    </label>
                  </Button>
                </div>
              </div>
            </div>
            
            {filteredSavedFilters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Filter className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No saved filters</h3>
                <p className="text-sm text-muted-foreground">
                  {searchSavedFilters ? 
                    "No filters match your search. Try a different term." : 
                    "Create and save filters to access them quickly later."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredSavedFilters.map((filter, index) => (
                  <div 
                    key={index}
                    className="p-4 border rounded-md hover:bg-accent/20"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{filter.name}</h4>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editFilter(index)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setConditions(filter.conditions);
                            applyFilter();
                          }}
                        >
                          Apply
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => deleteFilter(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {filter.conditions.length} condition{filter.conditions.length !== 1 ? 's' : ''}
                    </div>
                    {showAdvancedOptions && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <details>
                          <summary className="cursor-pointer">Show conditions</summary>
                          <div className="mt-2 space-y-1">
                            {filter.conditions.map((cond, i) => (
                              <div key={i} className="flex items-center gap-1">
                                {i > 0 && (
                                  <span className="font-semibold">{cond.conjunction}</span>
                                )}
                                <span className="font-medium">
                                  {filterFields.find(f => f.id === cond.field)?.label}
                                </span>
                                <span>{cond.operator}</span>
                                <span className="font-medium">
                                  {typeof cond.value === 'object' ? 
                                    JSON.stringify(cond.value) : 
                                    String(cond.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomFilterDialogContent;
