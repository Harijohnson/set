"use client"

import { format, startOfMonth, getDay, getDaysInMonth, parse, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Expense, Tag } from "./expense-manager"

interface CalendarViewProps {
  currentMonth: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  expenses: Expense[]
  tags: Tag[]
}

export function CalendarView({ currentMonth, onPreviousMonth, onNextMonth, expenses, tags }: CalendarViewProps) {
  const monthStart = startOfMonth(currentMonth)
  const startDay = getDay(monthStart)
  const daysInMonth = getDaysInMonth(currentMonth)

  // Group expenses by day
  const expensesByDay: Record<number, Expense[]> = {}
  expenses.forEach((expense) => {
    const day = Number.parseInt(format(new Date(expense.date), "d"))
    if (!expensesByDay[day]) {
      expensesByDay[day] = []
    }
    expensesByDay[day].push(expense)
  })

  // Create calendar days
  const days = []
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10 border-[0.5px] border-zinc-600"></div>)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = parse(`${day}/${format(currentMonth, "MM/yyyy")}`, "d/MM/yyyy", new Date())
    const dayExpenses = expensesByDay[day] || []
    const isCurrentDay = isToday(date)

    days.push(
      <div
        key={day}
        className={`relative h-10 w-10 border-[0.5px] border-zinc-600 flex items-center justify-center ${
          isCurrentDay ? "bg-zinc-700" : "bg-zinc-900"
        }`}
      >
        <div className="rounded-full bg-zinc-800 h-7 w-7 flex items-center justify-center">{day}</div>
        <div className="absolute bottom-0 flex justify-center w-full">
          {dayExpenses.slice(0, 3).map((expense, index) => {
            const tag = tags.find((t) => t.id === expense.tagId)
            return (
              <div
                key={expense.id}
                className="h-2 w-2 rounded-full mx-0.5 mb-0.5"
                style={{ backgroundColor: tag?.color || "#888" }}
              ></div>
            )
          })}
          {dayExpenses.length > 3 && (
            <div className="h-2 w-2 rounded-full mx-0.5 mb-0.5 bg-white text-[6px] flex items-center justify-center">
              +
            </div>
          )}
        </div>
      </div>,
    )
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onPreviousMonth} className="text-white">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM - yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={onNextMonth} className="text-white">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="bg-zinc-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-0">
          {weekdays.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-sm text-gray-400 border-b border-zinc-600"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    </div>
  )
}
