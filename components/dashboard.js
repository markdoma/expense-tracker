import React from "react";
import { Pie } from "react-chartjs-2";
const filterExpenses = (expenses, user, category, paymentMethod) => {
  let filteredExpenses = expenses;

  if (user) {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.user === user
    );
  }

  if (category) {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.category === category
    );
  }

  if (paymentMethod) {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.paymentMethod === paymentMethod
    );
  }

  return filteredExpenses;
};
const Dashboard = ({ expenses }) => {
  // Define the filters (user, category, and payment method) based on your app's logic
  const userFilter = "John Doe";
  const categoryFilter = "Food";
  const paymentMethodFilter = "Credit Card";

  const filteredExpenses = filterExpenses(
    expenses,
    userFilter,
    categoryFilter,
    paymentMethodFilter
  );

  // Generate data for the pie chart
  const data = {
    labels: ["User", "Category", "Payment Method"],
    datasets: [
      {
        data: [
          filteredExpenses.length, // User filter count
          filteredExpenses.length, // Category filter count
          filteredExpenses.length, // Payment method filter count
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <h2>Expense Dashboard</h2>
      <Pie data={data} />
    </div>
  );
};

export default Dashboard;
