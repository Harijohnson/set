"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { ChevronLeft, ChevronRight, ArrowUpDown, Edit, Trash2, ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import type { Expense, Tag } from "@/components/expense-manager"
import { EditExpenseModal } from "@/components/edit-expense-modal"
import { AddExpenseModal } from "@/components/add-expense-modal"

type SortField = "date" | "tag" | "amount"
type SortDirection = "asc" | "desc"

export default function ExpensesPage() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    const savedTags = localStorage.getItem("tags")

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }

    if (savedTags) {
      setTags(JSON.parse(savedTags))
    }
  }, [])

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const startDate = startOfMonth(currentMonth)
    const endDate = endOfMonth(currentMonth)
    return expenseDate >= startDate && expenseDate <= endDate
  })

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1

    if (sortField === "date") {
      return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    if (sortField === "tag") {
      const tagA = tags.find((t) => t.id === a.tagId)?.name || ""
      const tagB = tags.find((t) => t.id === b.tagId)?.name || ""
      return multiplier * tagA.localeCompare(tagB)
    }

    if (sortField === "amount") {
      return multiplier * (a.amount - b.amount)
    }

    return 0
  })

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1)
    if (nextMonth <= new Date()) {
      setCurrentMonth(nextMonth)
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsEditModalOpen(true)
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const newExpenses = expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
    setExpenses(newExpenses)
    localStorage.setItem("expenses", JSON.stringify(newExpenses))
    setIsEditModalOpen(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const newExpenses = expenses.filter((expense) => expense.id !== id)
      setExpenses(newExpenses)
      localStorage.setItem("expenses", JSON.stringify(newExpenses))
    }
  }

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    }
    const updatedExpenses = [...expenses, newExpense]
    setExpenses(updatedExpenses)
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses))
    setIsAddModalOpen(false)
  }

  const addTag = (tag: Omit<Tag, "id">) => {
    const newTag = {
      ...tag,
      id: crypto.randomUUID(),
    }
    const updatedTags = [...tags, newTag]
    setTags(updatedTags)
    localStorage.setItem("tags", JSON.stringify(updatedTags))
    return newTag
  }

  return (
    <div className="min-h-screen bg-white text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2 text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Expense Data</h1>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={handlePreviousMonth} className="text-white">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-bold">{format(currentMonth, "MMMM - yyyy")}</h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-white">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="rounded-md border border-zinc-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-800">
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("date")}
                      className="text-white hover:text-white p-0 h-auto font-medium"
                    >
                      Day
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("tag")}
                      className="text-white hover:text-white p-0 h-auto font-medium"
                    >
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("amount")}
                      className="text-white hover:text-white p-0 h-auto font-medium ml-auto"
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px] text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.length > 0 ? (
                  sortedExpenses.map((expense) => {
                    const tag = tags.find((t) => t.id === expense.tagId)
                    return (
                      <TableRow key={expense.id} className="hover:bg-gray-900">
                        <TableCell className="font-medium">{format(new Date(expense.date), "d")}</TableCell>
                        <TableCell>{expense.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {tag && (
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }}></div>
                            )}
                            {tag?.name || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">₹{expense.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:text-gray-300"
                              onClick={() => handleEditExpense(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:text-red-500"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-white">
                      No expenses found for this month
                    </TableCell>
                  </TableRow>
                )}
                {sortedExpenses.length > 0 && (
                  <TableRow className="bg-zinc-800 font-bold">
                    <TableCell colSpan={3} className="text-right">
                      Total
                    </TableCell>
                    <TableCell className="text-right">₹{totalAmount.toLocaleString()}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full h-14 w-14 p-0 bg-black shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExpense={addExpense}
        tags={tags}
        onAddTag={addTag}
      />

      {editingExpense && (
        <EditExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingExpense(null)
          }}
          onUpdateExpense={handleUpdateExpense}
          tags={tags}
          expense={editingExpense}
        />
      )}
    </div>
  )
}
