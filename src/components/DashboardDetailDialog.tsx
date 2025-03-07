
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, CheckCircle, Clock, AlertTriangle, Ban } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type DashboardDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: "tasks" | "leads" | "clients" | "revenue" | "metrics";
  data: any[];
};

const DashboardDetailDialog = ({
  open,
  onOpenChange,
  title,
  type,
  data,
}: DashboardDetailDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter data by search term
  const filteredData = data.filter((item) => {
    if (searchTerm === "") return true;
    const searchFields = type === "tasks" 
      ? [item.title, item.client]
      : type === "leads" 
      ? [item.name, item.source, item.status]
      : type === "clients" 
      ? [item.name, item.location, item.type]
      : Object.values(item);
    
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Render different content based on type
  const renderRow = (item: any, index: number) => {
    if (type === "tasks") {
      const statusVariant = 
        item.status === "completed" ? "outline" :
        item.status === "in_progress" ? "default" :
        item.status === "to_do" ? "secondary" :
        "destructive";
      
      return (
        <div key={index} className="py-3 border-b last:border-b-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">{item.title}</h3>
            <Badge variant={statusVariant}>
              {item.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>Client: {item.client}</div>
            <div>Due: {item.due}</div>
          </div>
        </div>
      );
    } else if (type === "leads") {
      const statusVariant = 
        item.status === "converted" ? "outline" :
        item.status === "active" ? "secondary" :
        "destructive";
      
      return (
        <div key={index} className="py-3 border-b last:border-b-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">{item.name}</h3>
            <Badge variant={statusVariant}>
              {item.status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>Source: {item.source}</div>
            <div>Value: ${item.value}</div>
          </div>
        </div>
      );
    } else if (type === "clients") {
      const statusIcon = 
        item.status === "active" ? <CheckCircle className="h-4 w-4 text-green-500" /> :
        item.status === "pending" ? <Clock className="h-4 w-4 text-amber-500" /> :
        <Ban className="h-4 w-4 text-red-500" />;
      
      const statusVariant = 
        item.status === "active" ? "outline" :
        item.status === "pending" ? "secondary" :
        "destructive";
      
      return (
        <div key={index} className="py-3 border-b last:border-b-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">{item.name}</h3>
            <Badge variant={statusVariant} className="flex items-center gap-1">
              {statusIcon}
              {item.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-2 text-sm text-muted-foreground">
            <div>Jobs: {item.jobs}</div>
            <div>Revenue: ${item.revenue}</div>
            <div>Location: {item.location}</div>
            <div>Type: {item.type}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className="py-3 border-b last:border-b-0">
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="font-medium mr-2">{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {type === "tasks" && (
          <Tabs onValueChange={setActiveTab} value={activeTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="to_do">To Do</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="divide-y">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => renderRow(item, index))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No data found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDetailDialog;
