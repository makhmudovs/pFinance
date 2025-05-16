"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useAlert } from "@/providers/AlertProvider";
import { TransactionForm } from "@/components/transactions/transactions-form";
import { TransactionsType } from "@/types/types";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, ChevronDown, MoreHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useLocation } from "react-router-dom";
import { useAlertDialog } from "@/providers/AlertDialogProvider";
import { fetchTransactions } from "@/services/transactions";
import { Loader } from "@/components/shared/loader";

export function Transactions() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { showAlert } = useAlert();
  const location = useLocation();
  const { showDialog } = useAlertDialog();
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    retry: (failureCount, err) => {
      if (err.message.includes("Missing or insufficient permissions")) {
        return false; // Don't retry on permission errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "transactions", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      showAlert({
        title: "Heads up!",
        description: "Transaction deleted",
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        showAlert({
          title: "Error",
          description: error.message,
        });
      } else {
        showAlert({
          title: "Error",
          description: "Unknown error occured, plz reload",
        });
      }
    },
  });

  // Define the columns for the table
  const columns: ColumnDef<TransactionsType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("date")}</div>
      ),
    },
    {
      accessorKey: "recurring",
      header: "Recurring",
      cell: ({ row }) => (
        <div className="">
          {row.getValue("recurring") === true ? (
            <Check className="text-green-500 h-5 w-5" />
          ) : (
            <X className="text-red-500 h-5 w-5" />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(transaction.id);
                  showAlert({
                    title: "Heads up!",
                    description: `Id copied to clipboard ${transaction.id}`,
                  });
                }}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  showDialog({
                    title: "Confirm Deletion",
                    description: "Are you sure you want to delete transaction?",
                    confirmLabel: "Delete",
                    onConfirm: async () => {
                      //delete transaction
                      deleteTransactionMutation.mutate(transaction.id);
                    },
                  });
                }}
              >
                Delete transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/transactions/${transaction.id}`}
                  state={{ previousLocation: location }}
                >
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <Loader />;
  if (error) {
    const errorMessage = error.message.includes(
      "Missing or insufficient permissions"
    )
      ? "You do not have permission to access this data. Please log in or contact support."
      : "Failed to fetch data. Please try again later.";
    return <div className="text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <TransactionForm />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
