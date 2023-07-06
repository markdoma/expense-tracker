import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { firestore } from "../utils/firebase";

// Initialize Firebase with your Firebase project credentials
// Replace the values below with your own Firebase configuration

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    // Fetch expenses data from Firestore collection
    const fetchExpenses = async () => {
      try {
        const expensesRef = firestore.collection("expenses");
        const snapshot = await expensesRef.get();
        const expensesData = snapshot.docs.map((doc) => doc.data());
        setExpenses(expensesData);
        setFilteredExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleFilter = (user, category, paymentMethod) => {
    let filteredData = expenses;

    if (user) {
      filteredData = filteredData.filter((expense) => expense.user === user);
    }

    if (category) {
      filteredData = filteredData.filter(
        (expense) => expense.category === category
      );
    }

    if (paymentMethod) {
      filteredData = filteredData.filter(
        (expense) => expense.paymentMethod === paymentMethod
      );
    }

    setFilteredExpenses(filteredData);
  };

  // Get unique values for filtering options
  const getUsers = () => [...new Set(expenses.map((expense) => expense.user))];
  const getCategories = () => [
    ...new Set(expenses.map((expense) => expense.category)),
  ];
  const getPaymentMethods = () => [
    ...new Set(expenses.map((expense) => expense.paymentMethod)),
  ];

  // Calculate total expenses for each category
  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    filteredExpenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    return categoryTotals;
  };

  const categoryTotals = calculateCategoryTotals();

  // Prepare data for the pie chart
  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF8A80",
          "#B9F6CA",
          "#FFD180",
          "#64B5F6",
          "#E6EE9C",
        ],
      },
    ],
  };

  return (
    <div>
      <div>
        <label htmlFor="user">User:</label>
        <select
          id="user"
          onChange={(e) => handleFilter(e.target.value, null, null)}
          defaultValue=""
        >
          <option value="">All</option>
          {getUsers().map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          onChange={(e) => handleFilter(null, e.target.value, null)}
          defaultValue=""
        >
          <option value="">All</option>
          {getCategories().map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="paymentMethod">Payment Method:</label>
        <select
          id="paymentMethod"
          onChange={(e) => handleFilter(null, null, e.target.value)}
          defaultValue=""
        >
          <option value="">All</option>
          {getPaymentMethods().map((paymentMethod) => (
            <option key={paymentMethod} value={paymentMethod}>
              {paymentMethod}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
