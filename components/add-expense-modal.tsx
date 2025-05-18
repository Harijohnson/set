"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { Expense, Tag } from "./expense-manager"
import { TagSelector } from "./tag-selector"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .refine((val) => !isNaN(val), "Amount must be a valid number")
    .refine((val) => val <= 1000000, "Amount must be less than 1,000,000"),
  date: z.date({
    required_error: "Date is required",
  }),
  tagId: z.string().min(1, "Category is required"),
})

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onAddExpense: (expense: Omit<Expense, "id">) => void
  tags: Tag[]
  onAddTag: (tag: Omit<Tag, "id">) => Tag
}

export function AddExpenseModal({ isOpen, onClose, onAddExpense, tags, onAddTag }: AddExpenseModalProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      date: new Date(),
      tagId: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAddExpense({
      name: values.name,
      amount: values.amount,
      date: values.date.toISOString(),
      tagId: values.tagId,
    })
    form.reset({
      name: "",
      amount: undefined,
      date: new Date(),
      tagId: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription className="text-gray-400">Fill in the details to add a new expense.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Groceries, Rent, etc." {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      className="bg-zinc-800 border-zinc-700"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? undefined : Number.parseFloat(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-zinc-800 border-zinc-700",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700" align="start" >
                      <Calendar

                        mode="single"
                      
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date)
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="bg-zinc-800"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <TagSelector
                      tags={tags}
                      selectedTagId={field.value}
                      onSelectTag={(value) => field.onChange(value)}
                      onAddTag={onAddTag}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="bg-gray-900">
                Cancel
              </Button>
              <Button type="submit">Add Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
