import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: { from?: Date; to?: Date };
  onChange: (value: { from?: Date; to?: Date }) => void;
  placeholder?: string;
  testId?: string;
}

export function DateRangePicker({ value, onChange, placeholder = "Pick a date range", testId }: DateRangePickerProps) {
  const hasValue = value.from || value.to;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({});
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          data-testid={testId}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value.from ? (
            value.to ? (
              <>
                {format(value.from, "MM/dd/yyyy")} - {format(value.to, "MM/dd/yyyy")}
              </>
            ) : (
              format(value.from, "MM/dd/yyyy")
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {hasValue && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from: value.from, to: value.to }}
          onSelect={(range) => {
            onChange({
              from: range?.from,
              to: range?.to,
            });
          }}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
