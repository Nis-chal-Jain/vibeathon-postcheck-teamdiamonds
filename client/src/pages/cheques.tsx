import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Filter, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateChequeDialog } from "@/components/create-cheque-dialog";
import { DateRangePicker } from "@/components/date-range-picker";
import type { Cheque } from "@shared/schema";

export default function ChequesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [issueDateRange, setIssueDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [dueDateRange, setDueDateRange] = useState<{ from?: Date; to?: Date }>({});

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (issueDateRange.from) params.append("issueStart", format(issueDateRange.from, "yyyy-MM-dd"));
    if (issueDateRange.to) params.append("issueEnd", format(issueDateRange.to, "yyyy-MM-dd"));
    if (dueDateRange.from) params.append("dueStart", format(dueDateRange.from, "yyyy-MM-dd"));
    if (dueDateRange.to) params.append("dueEnd", format(dueDateRange.to, "yyyy-MM-dd"));
    return params.toString();
  };

  const { data: cheques, isLoading } = useQuery<Cheque[]>({
    queryKey: ["/api/cheques", statusFilter, issueDateRange, dueDateRange],
    queryFn: async () => {
      const queryString = buildQueryParams();
      const url = queryString ? `/api/cheques?${queryString}` : "/api/cheques";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch cheques");
      return response.json();
    },
  });

  const hasActiveFilters = statusFilter !== "all" || issueDateRange.from || issueDateRange.to || dueDateRange.from || dueDateRange.to;

  const clearFilters = () => {
    setStatusFilter("all");
    setIssueDateRange({});
    setDueDateRange({});
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "past":
        return "destructive";
      case "today":
        return "default";
      case "upcoming":
        return "secondary";
      case "cancelled":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Cheque Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all your cheques in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/chat">
              <Button variant="outline" className="gap-2" data-testid="button-open-chat">
                <MessageSquare className="h-4 w-4" />
                AI Assistant
              </Button>
            </Link>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2"
              data-testid="button-create-cheque"
            >
              <Plus className="h-4 w-4" />
              New Cheque
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">Filters</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-xs"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Issue Date Range</label>
              <DateRangePicker
                value={issueDateRange}
                onChange={setIssueDateRange}
                placeholder="Select issue date range"
                testId="date-range-issue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Due Date Range</label>
              <DateRangePicker
                value={dueDateRange}
                onChange={setDueDateRange}
                placeholder="Select due date range"
                testId="date-range-due"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wide">
                    Cheque Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wide">
                    Payee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wide">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wide">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-foreground uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-5 w-20" />
                      </td>
                    </tr>
                  ))
                ) : cheques && cheques.length > 0 ? (
                  cheques.map((cheque) => (
                    <tr
                      key={cheque.chequeId}
                      className="hover-elevate"
                      data-testid={`row-cheque-${cheque.chequeId}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-foreground" data-testid={`text-cheque-number-${cheque.chequeId}`}>
                          {cheque.chequeNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground" data-testid={`text-payee-${cheque.chequeId}`}>
                          {cheque.toPayee}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {format(new Date(cheque.issuedDate), "MM/dd/yyyy")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {format(new Date(cheque.dueDate), "MM/dd/yyyy")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-mono text-foreground" data-testid={`text-amount-${cheque.chequeId}`}>
                          {formatCurrency(cheque.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(cheque.status)} data-testid={`badge-status-${cheque.chequeId}`}>
                          {cheque.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="rounded-full bg-muted p-4">
                          <Filter className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-base font-medium text-foreground mb-1">
                            No cheques found
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {hasActiveFilters
                              ? "Try adjusting your filters or create a new cheque"
                              : "Get started by creating your first cheque"}
                          </p>
                          <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            variant="outline"
                            className="gap-2"
                            data-testid="button-create-first-cheque"
                          >
                            <Plus className="h-4 w-4" />
                            Create Cheque
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <CreateChequeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
