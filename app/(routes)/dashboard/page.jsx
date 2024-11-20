
"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { Menu, X,LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign, } from "lucide-react";

function Dashboard() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
    getAllExpenses();
    getIncomeList();
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id);

      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  return (
    <div className="relative min-h-screen">
      {/* Hamburger Menu Button - Only visible on small screens */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg hover:bg-gray-100"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 pt-20">
          <nav className="space-y-4">
            <a href="/dashboard" className="flex items-center hover:bg-gray-100 p-2 rounded-lg">
              <LayoutGrid className="mr-2 h-5 w-5 text-gray-600" />
              Dashboard
            </a>
            <a href="/dashboard/incomes" className="flex items-center hover:bg-gray-100 p-2 rounded-lg">
              <CircleDollarSign className="mr-2 h-5 w-5 text-gray-600" />
              Incomes
            </a>
            <a href="/dashboard/budgets" className="flex items-center hover:bg-gray-100 p-2 rounded-lg">
              <PiggyBank className="mr-2 h-5 w-5 text-gray-600" />
              Budgets
            </a>
            <a href="/dashboard/expenses" className="flex items-center hover:bg-gray-100 p-2 rounded-lg">
              <ReceiptText className="mr-2 h-5 w-5 text-gray-600" />
              Expenses
            </a>
          
            <a href="/dashboard/upgrade" className="flex items-center hover:bg-gray-100 p-2 rounded-lg">
              <ShieldCheck className="mr-2 h-5 w-5 text-gray-600" />
              Upgrade
            </a>
          </nav>
        </div>
      </div>

      {/* Overlay - Only visible when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="w-full">
        <div className="p-8">
          <h2 className="font-bold text-4xl">Hi, {user?.fullName} 👋</h2>
          <p className="text-gray-500">
            Here's what happening with your money, Let's Manage your expense
          </p>

          <CardInfo budgetList={budgetList} incomeList={incomeList} />
          <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
            <div className="lg:col-span-2">
              <BarChartDashboard budgetList={budgetList} />
              <ExpenseListTable
                expensesList={expensesList}
                refreshData={() => getBudgetList()}
              />
            </div>
            <div className="grid gap-5">
              <h2 className="font-bold text-lg">Latest Budgets</h2>
              {budgetList?.length > 0
                ? budgetList.map((budget) => (
                    <BudgetItem key={budget.id || budget.name} budget={budget} />
                  ))
                : [1, 2, 3, 4].map((item, index) => (
                    <div
                      key={index}
                      className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;