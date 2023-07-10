import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import { firestore } from "../utils/firebase";

const BudgetComponent = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    // const firestore = getFirestore(); // Initialize your Firestore instance
    // Fetch budget amount
    const unsubscribeBudget = firestore
      .collection("budget")
      .onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const budgetData = doc.data();
          setBudget(budgetData.Budget);
        });
      });

    const unsubscribeExpenses = firestore
      .collection("expenses")
      .onSnapshot((snapshot) => {
        const categoryTotals = {};
        snapshot.docs.forEach((doc) => {
          const expenseData = doc.data();
          const { amount, category } = expenseData;

          if (category in categoryTotals) {
            categoryTotals[category] += amount;
          } else {
            categoryTotals[category] = amount;
          }
        });
        setExpenses(categoryTotals);
      });

    return () => {
      unsubscribeBudget();
      unsubscribeExpenses();
    };
  }, []);

  useEffect(() => {
    const calculateRemainingBudget = () => {
      let totalExpenses = 0;

      Object.values(expenses).forEach((categoryTotal) => {
        totalExpenses += categoryTotal;
      });

      setRemainingBudget(budget - totalExpenses);
    };

    calculateRemainingBudget();
  }, [expenses, budget]);

  return (
    <div className="flex justify-center">
      <div className="overflow-x-auto">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2">Total</th>
              {/* <th className="px-2 py-2">Status</th> */}
              <th className="px-2 py-2">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(expenses).map(([category, total]) => (
              <tr key={category} className={total > budget ? "bg-red-200" : ""}>
                <td className="px-2 py-2 flex justify-center">{category}</td>
                <td className="px-2 py-2">{total}</td>
                {/* <td className="px-2 py-2 ">{total > budget ? "Over" : ""}</td> */}
                <td className="px-2 py-2 flex justify-center">
                  {budget - total}
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
