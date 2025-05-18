"use client"

import { useEffect, useState } from "react"
import { addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { useRouter } from "next/navigation"
import { CalendarView } from "@/components/calendar-view"
import { TagsList } from "@/components/tags-list"
import { SpiderChart } from "@/components/spider-chart"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"

export type Expense = {
  id: string
  name: string
  amount: number
  date: string
  tagId: string
}

export type Tag = {
  id: string
  name: string
  color: string
}

export function ExpenseManager() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load data from localStorage on component mount, only in browser
  useEffect(() => {
    if (isClient) {
      const savedExpenses = localStorage.getItem("expenses")
      const savedTags = localStorage.getItem("tags")
      const savedMonth = localStorage.getItem("currentMonth")

      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses))
      }

      if (savedTags) {
        setTags(JSON.parse(savedTags))
      } else {
        // Set some default tags if none exist
        const defaultTags = [
          { id: "1", name: "Food", color: "#3b5bdb" },
          { id: "2", name: "Entertainment", color: "#94d82d" },
          { id: "3", name: "Books", color: "#38d9a9" },
          { id: "4", name: "Subscription", color: "#e03131" },
          { id: "5", name: "Investment", color: "#cc5de8" },
          { id: "6", name: "Groceries", color: "#495057" },
        ]
        setTags(defaultTags)
        localStorage.setItem("tags", JSON.stringify(defaultTags))
      }

      if (savedMonth) {
        setCurrentMonth(new Date(savedMonth))
      }
    }
  }, [isClient])

  // Save data to localStorage whenever it changes, only in browser
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("expenses", JSON.stringify(expenses))
    }
  }, [expenses, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("tags", JSON.stringify(tags))
    }
  }, [tags, isClient])

  useEffect(() => {
    if (isClient) {
      // Save current month to localStorage
      localStorage.setItem("currentMonth", currentMonth.toISOString())
    }
  }, [currentMonth, isClient])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    }
    setExpenses([...expenses, newExpense])
    setIsAddModalOpen(false)
  }

  const addTag = (tag: Omit<Tag, "id">) => {
    const newTag = {
      ...tag,
      id: crypto.randomUUID(),
    }
    setTags([...tags, newTag])
    return newTag
  }

  const updateTag = (updatedTag: Tag) => {
    setTags(tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)))
  }

  const deleteTag = (id: string) => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this tag?")) {
      // Check if tag is used in any expense
      const isTagUsed = expenses.some((expense) => expense.tagId === id)
      if (isTagUsed) {
        alert("This tag is used in expenses and cannot be deleted.")
        return
      }
      setTags(tags.filter((tag) => tag.id !== id))
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const startDate = startOfMonth(currentMonth)
    const endDate = endOfMonth(currentMonth)
    return expenseDate >= startDate && expenseDate <= endDate
  })

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1)
    if (nextMonth <= new Date()) {
      setCurrentMonth(nextMonth)
    }
  }

  return (
    <div className="w-full max-w-full m-auto my-10">
      <div className="flex flex-col md:flex-row justify-center align-middle ">
        <div className="w-full md:w-[40%] h-[80vh]">
          <div className="bg-black rounded-lg p-4 mb-4 md:mb-0 md:mr-2 h-[80vh]">
            <CalendarView
              currentMonth={currentMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              expenses={filteredExpenses}
              tags={tags}
            />
          </div>
        </div>

        <div className="w-full md:w-[20%] flex flex-col items-center justify-end">
          <TagsList tags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag} />

          <div className="mt-6 flex justify-center space-x-4">
            <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full h-12 w-12 p-0 bg-black">
              <Plus className="h-6 w-6" />
            </Button>
            <Button onClick={() => router.push("/expenses")} className="rounded-full h-12 w-12 p-0 bg-black">
              <Eye className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="w-full md:w-[40%]">
          <div className="bg-black rounded-lg p-4 mt-4 md:mt-0 md:ml-2 h-[80vh]">
            <SpiderChart
              currentMonth={currentMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              expenses={filteredExpenses}
              tags={tags}
            />
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExpense={addExpense}
        tags={tags}
        onAddTag={addTag}
      />
    </div>
  )
}
