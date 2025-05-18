"use client"

import { format, startOfMonth, getDay, getDaysInMonth, parse, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Expense, Tag } from "./expense-manager"
import Image from "next/image"
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

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const totalCells = 42 // 6 weeks × 7 days
  const days = []

  for (let i = 0; i < totalCells; i++) {
    const dayOfMonth = i - startDay + 1

    if (i < startDay || dayOfMonth > daysInMonth) {
      // Empty cells before or after the actual month days
      days.push(
        <div
          key={`empty-${i}`}
          className="h-10 w-10 border-[0.5px] border-zinc-600 bg-zinc-800 rounded-md p-2"
        > 
        <Image 
        src="smile.svg"
        alt="smile"
        width={7}
        height={7}
        className="w-full h-full"
        ></Image>
         </div>
      )
    } else {
      const date = parse(`${dayOfMonth}/${format(currentMonth, "MM/yyyy")}`, "d/MM/yyyy", new Date())
      const dayExpenses = expensesByDay[dayOfMonth] || []
      const isCurrentDay = isToday(date)

      days.push(
        <div
          key={dayOfMonth}
          className={`relative h-10 w-10 border-[0.5px] border-zinc-900 rounded-md  flex items-center justify-center ${
            isCurrentDay ? "bg-stone-500" : "bg-zinc-900"
          }`}
        >
          <div className="rounded-full bg-zinc-300 h-7 w-7 flex items-center justify-center">
            {dayOfMonth}
          </div>
          <div className="absolute bottom-0 flex justify-center w-full">
            {dayExpenses.slice(0, 3).map((expense) => {
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
        </div>
      )
    }
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPreviousMonth}
          className="text-black border-zinc-600 bg-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-white">{format(currentMonth, "MMMM - yyyy")}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          className="text-black border-zinc-600 bg-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="bg-zinc-800 rounded-lg overflow-hidden p-5">
        <div className="grid grid-cols-7 gap-7">
          {weekdays.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-sm text-gray-400 border-b border-zinc-900"
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
