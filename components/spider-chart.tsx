"use client"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts"
import type { Expense, Tag } from "./expense-manager"

interface SpiderChartProps {
  currentMonth: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  expenses: Expense[]
  tags: Tag[]
}

// Improve the tooltip to show the exact amount
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 p-2 border border-zinc-700 rounded-md">
        <p className="text-white font-medium">{`${payload[0].name}: ₹${payload[0].value?.toLocaleString()}`}</p>
      </div>
    )
  }

  return null
}

export function SpiderChart({ currentMonth, onPreviousMonth, onNextMonth, expenses, tags }: SpiderChartProps) {
  // Calculate totals by tag
  const tagTotals: Record<string, number> = {}
  expenses.forEach((expense) => {
    if (!tagTotals[expense.tagId]) {
      tagTotals[expense.tagId] = 0
    }
    tagTotals[expense.tagId] += expense.amount
  })

  // Prepare data for radar chart
  const chartData = tags.map((tag) => ({
    subject: tag.name,
    A: tagTotals[tag.id] || 0,
    fullMark: Math.max(...Object.values(tagTotals), 1000),
    color: tag.color,
  }))

  // Calculate total expenses
  const totalExpenses = Object.values(tagTotals).reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onPreviousMonth} className="text-black border-zinc-600 bg-white">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-white">{format(currentMonth, "MMMM - yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={onNextMonth} className="text-black border-zinc-600 bg-white">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="h-[64vh]">
          <div className="text-white flex justify-center top-4">Total Spent: ₹{totalExpenses.toLocaleString()}</div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#fff" }} />
              <PolarRadiusAxis angle={0} domain={[0, "auto"]} tick={{ fill: "#888" }} />
              <Radar name="Spent" dataKey="A" stroke="#bbbbbb" fill="#bbbbbb" fillOpacity={0.6} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  )
}
