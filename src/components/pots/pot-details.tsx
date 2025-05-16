import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { PotDetailsFormTypes } from "@/types/types";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader } from "../shared/loader";
import { fetchPot, updatePot } from "@/services/pots";

export function PotDetails() {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors, isDirty },
  } = useForm<PotDetailsFormTypes>({
    defaultValues: {
      name: "",
      goal_amount: 0,
      current_amount: 0,
      theme: "green",
    },
  });

  const modalRef2 = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pot", id],
    queryFn: () => fetchPot(id!),
    enabled: !!id,
  });

  // Update form with fetched data
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        goal_amount: data.goal_amount,
        current_amount: data.current_amount,
        theme: data.theme,
      });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: PotDetailsFormTypes;
    }) => updatePot(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pot", id] });
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      setEdit(false);
      navigate("/pots");
    },
    onError: (error) => {
      console.error("Error updating pot:", error);
    },
  });

  const onSubmit = (formData: PotDetailsFormTypes) => {
    if (!id) throw new Error("Pot ID is missing");
    updateMutation.mutate({ id, formData });
  };

  useEffect(() => {
    const observerRefValue = modalRef2.current;
    if (observerRefValue) {
      disableBodyScroll(observerRefValue);
    }

    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading pot: {error.message}</div>;

  return (
    <motion.div
      ref={modalRef2}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-muted/95"
      onClick={() => navigate("/pots")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pot Details</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit"
                  checked={edit}
                  onCheckedChange={() => setEdit(!edit)}
                />
                <Label htmlFor="edit">{edit ? "Update" : "Read Only"}</Label>
              </div>
            </div>
            <CardDescription>Details for pot {id}.</CardDescription>
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
              <Label className="text-sm font-light" htmlFor="goal_amount">
                Goal Amount
              </Label>
              <Controller
                name="goal_amount"
                control={control}
                rules={{
                  required: "Goal amount is required",
                  min: {
                    value: 1,
                    message: "Goal amount must be greater than 0",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="goal_amount"
                    type="number"
                    step="0.01"
                    disabled={!edit}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
              {errors.goal_amount && (
                <p className="text-red-500 text-sm font-light">
                  {errors.goal_amount.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="current_amount">
                Current Amount
              </Label>
              <Controller
                name="current_amount"
                control={control}
                rules={{
                  required: "Current amount is required",
                  min: {
                    value: 0,
                    message: "Current amount cannot be negative",
                  },
                }}
                render={({ field }) => (
                  <Input
                    id="current_amount"
                    type="number"
                    step="0.01"
                    disabled={!edit}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
              {errors.current_amount && (
                <p className="text-red-500 text-sm font-light">
                  {errors.current_amount.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-light" htmlFor="theme">
                Theme
              </Label>
              <Controller
                name="theme"
                control={control}
                rules={{ required: "Theme is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!edit}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        <SelectItem value="red" className="text-red-500">
                          Red
                        </SelectItem>
                        <SelectItem value="orange" className="text-orange-500">
                          Orange
                        </SelectItem>
                        <SelectItem value="yellow" className="text-yellow-500">
                          Yellow
                        </SelectItem>
                        <SelectItem value="lime" className="text-lime-500">
                          Lime
                        </SelectItem>
                        <SelectItem value="green" className="text-green-500">
                          Green
                        </SelectItem>
                        <SelectItem
                          value="emerald"
                          className="text-emerald-500"
                        >
                          Emerald
                        </SelectItem>
                        <SelectItem value="teal" className="text-teal-500">
                          Teal
                        </SelectItem>
                        <SelectItem value="cyan" className="text-cyan-500">
                          Cyan
                        </SelectItem>
                        <SelectItem value="sky" className="text-sky-500">
                          Sky
                        </SelectItem>
                        <SelectItem value="blue" className="text-blue-500">
                          Blue
                        </SelectItem>
                        <SelectItem value="indigo" className="text-indigo-500">
                          Indigo
                        </SelectItem>
                        <SelectItem value="violet" className="text-violet-500">
                          Violet
                        </SelectItem>
                        <SelectItem value="purple" className="text-purple-500">
                          Purple
                        </SelectItem>
                        <SelectItem
                          value="fuchsia"
                          className="text-fuchsia-500"
                        >
                          Fuchsia
                        </SelectItem>
                        <SelectItem value="pink" className="text-pink-500">
                          Pink
                        </SelectItem>
                        <SelectItem value="rose" className="text-rose-500">
                          Rose
                        </SelectItem>
                        <SelectItem value="slate" className="text-slate-500">
                          Slate
                        </SelectItem>
                        <SelectItem value="gray" className="text-gray-500">
                          Gray
                        </SelectItem>
                        <SelectItem value="zinc" className="text-zinc-500">
                          Zinc
                        </SelectItem>
                        <SelectItem
                          value="neutral"
                          className="text-neutral-500"
                        >
                          Neutral
                        </SelectItem>
                        <SelectItem value="stone" className="text-stone-500">
                          Stone
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.theme && (
                <p className="text-red-500 text-sm font-light">
                  {errors.theme.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/pots")}
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
