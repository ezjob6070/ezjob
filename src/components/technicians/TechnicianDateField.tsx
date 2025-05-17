
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { PopoverClose } from "@radix-ui/react-popover";

interface TechnicianDateFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
}

export function TechnicianDateField({ 
  control, 
  name, 
  label, 
  description 
}: TechnicianDateFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date ? format(date as Date, "yyyy-MM-dd") : "")}
                disabled={false}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <PopoverClose>
                <Button className="w-full" variant="secondary">Close</Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
