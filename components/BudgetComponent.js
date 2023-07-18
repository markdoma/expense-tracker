import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import { firestore } from "../utils/firebase";

const BudgetComponent = () => {
  const [budget, setBudget] = useState({});
  const [expenses, setExpenses] = useState({});
  const [remainingBudget, setRemainingBudget] = useState({});
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [filteredTotal, setFilteredTotal] = useState(0);

  useEffect(() => {
    const unsubscribeBudget = firestore
      .collection("budget")
      .onSnapshot((snapshot) => {
        const categoryBudget = {};
        snapshot.docs.forEach((doc) => {
          const budgetData = doc.data();
          const { Budget, Category } = budgetData;
          categoryBudget[Category] = Budget;
        });
        setBudget(categoryBudget);
      });

    const unsubscribeExpenses = firestore
      .collection("expenses")
      .onSnapshot((snapshot) => {
        const categoryTotals = {};
        let total = 0;
        snapshot.docs.forEach((doc) => {
          const expenseData = doc.data();
          const { amount, category, monthYear } = expenseData;

          if (!selectedMonthYear || monthYear === selectedMonthYear) {
            if (category in categoryTotals) {
              categoryTotals[category] += amount;
            } else {
              categoryTotals[category] = amount;
            }

            if (!selectedMonthYear) {
              total += amount;
            }
          }
        });
        setExpenses(categoryTotals);
        setFilteredTotal(total);
      });

    return () => {
      unsubscribeBudget();
      unsubscribeExpenses();
    };
  }, [selectedMonthYear]);

  useEffect(() => {
    const calculateRemainingBudget = () => {
      const remainingBudgetPerCategory = {};

      Object.keys(budget).forEach((category) => {
        const categoryTotal = expenses[category] || 0;
        remainingBudgetPerCategory[category] = budget[category] - categoryTotal;
      });

      setRemainingBudget(remainingBudgetPerCategory);
    };

    calculateRemainingBudget();
  }, [budget, expenses]);

  const handleMonthYearChange = (event) => {
    setSelectedMonthYear(event.target.value);
  };

  return (
    <div className="flex justify-center">
      <div className="overflow-x-auto">
        <div className="mb-4">
          <label className="mr-2">Filter by Month-Year:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedMonthYear}
            onChange={handleMonthYearChange}
          >
            <option value="">All</option>
            <option value="2023-01">January 2023</option>
            <option value="2023-02">February 2023</option>
            <option value="2023-03">March 2023</option>
            {/* Add more options for each Month-Year */}
          </select>
        </div>
        <div className="mb-4">
          <div className="bg-gray-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              Total for Filtered Month-Year:
            </h3>
            <p className="text-2xl font-bold text-center">
              {filteredTotal.toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })}
            </p>
          </div>
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2">Total</th>
              <th className="px-2 py-2">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(expenses).map((category) => (
              <tr
                key={category}
                className={
                  expenses[category] > budget[category] ? "bg-red-200" : ""
                }
              >
                <td className="px-2 py-2 flex justify-center">{category}</td>
                <td className="px-2 py-2">
                  {expenses[category].toFixed(2) || 0}
                </td>
                <td className="px-2 py-2 flex justify-center">
                  {remainingBudget[category]
                    ? remainingBudget[category].toFixed(2)
                    : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetComponent;
