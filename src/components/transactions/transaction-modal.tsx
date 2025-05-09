import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTransaction, updateTransaction } from "@/services/transactions";
import { format } from "date-fns";

import { motion } from "framer-motion";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { cn } from "@/lib/utils";

import { TransactionDetailsFormTypes } from "@/types/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function TransactionModal() {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors, isDirty },
  } = useForm<TransactionDetailsFormTypes>({
    defaultValues: {
      name: "",
      date: "",
      category: "entertainment",
      amount: 0,
      recurring: false,
    },
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => fetchTransaction(id!),
    enabled: !!id,
  });

  // Update form with fetched data
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        date: data.date,
        category: data.category,
        amount: data.amount,
        recurring: data.recurring,
      });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: TransactionDetailsFormTypes;
    }) => updateTransaction(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction", id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEdit(false);
      navigate("/transactions");
    },
    onError: (error) => {
      console.error("Error updating transaction:", error);
    },
  });

  const onSubmit = (formData: TransactionDetailsFormTypes) => {
    if (!id) throw new Error("Transaction ID is missing");
    updateMutation.mutate({ id, formData });
  };

  useEffect(() => {
    const observerRefValue = modalRef.current;
    if (observerRefValue) {
      disableBodyScroll(observerRefValue);
    }

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading transaction: {error.message}</div>;
  if (!data) return <div>Transaction not found</div>;

  return (
    <motion.div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-muted/95"
      onClick={() => navigate("/transactions")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transaction Details</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit"
                  checked={edit}
                  onCheckedChange={() => setEdit(!edit)}
                />
                <Label htmlFor="edit">{edit ? "Editing" : "View"}</Label>
              </div>
            </div>
            <CardDescription>Details for transaction {id}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="name">
                Name
              </Label>
              <Input
                {...register("name", { required: "Name is required" })}
                disabled={!edit}
                id="name"
                type="text"
              />
              {errors.name && (
                <p className="text-red-500 text-sm font-light">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="amount">
                Amount
              </Label>
              <Controller
                name="amount"
                control={control}
                rules={{ required: "Amount is required", min: 0 }}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    disabled={!edit}
                    value={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm font-light">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="category">
                Category
              </Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!edit}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="bill">Bills</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="dining-out">Dining Out</SelectItem>
                        <SelectItem value="transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="personal-care">
                          Personal Care
                        </SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm font-light">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="date">
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!edit}
                      >
                        {field.value
                          ? format(new Date(field.value), "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? "")
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              {errors.date && (
                <p className="text-red-500 text-sm font-light">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="recurring">
                Recurring
              </Label>
              <Controller
                name="recurring"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value ? "true" : "false"}
                    disabled={!edit}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select recurring status" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Recurring</SelectLabel>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/transactions")}
            >
              Cancel
            </Button>
            {edit && (
              <Button
                type="submit"
                disabled={!isDirty || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
