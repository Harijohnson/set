"use client"

import { useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Expense, Tag } from "./expense-manager"

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

interface EditExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateExpense: (expense: Expense) => void
  tags: Tag[]
  expense: Expense
}

export function EditExpenseModal({ isOpen, onClose, onUpdateExpense, tags, expense }: EditExpenseModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: expense.name,
      amount: expense.amount,
      date: new Date(expense.date),
      tagId: expense.tagId,
    },
  })

  // Update form when expense changes
  useEffect(() => {
    form.reset({
      name: expense.name,
      amount: expense.amount,
      date: new Date(expense.date),
      tagId: expense.tagId,
    })
  }, [expense, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdateExpense({
      ...expense,
      name: values.name,
      amount: values.amount,
      date: values.date.toISOString(),
      tagId: values.tagId,
    })
  }

  const selectedTag = tags.find((tag) => tag.id === form.watch("tagId"))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription className="text-gray-400">Update the details of this expense.</DialogDescription>
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
                      value={field.value}
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
                    <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-700" align="start">
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
                    <div className="relative">
                      <Button variant="outline" className="w-full justify-between bg-zinc-800 border-zinc-700">
                        {selectedTag ? (
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: selectedTag.color }} />
                            {selectedTag.name}
                          </div>
                        ) : (
                          "Select a category"
                        )}
                      </Button>
                      <select
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {tags.map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="bg-gray-900">
                Cancel
              </Button>
              <Button type="submit">Update Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
