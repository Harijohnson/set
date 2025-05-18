import { ExpenseManager } from "@/components/expense-manager"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-4 w-full">
      <ExpenseManager />
    </main>
  )
}
