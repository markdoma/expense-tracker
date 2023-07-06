import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { firestore } from "../utils/firebase";

// Import ApexCharts dynamically to prevent server-side rendering issues
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [userFilter, setUserFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");

  const [userChartFilter, setUserChartFilter] = useState("");
  const [categoryChartFilter, setCategoryChartFilter] = useState("");
  const [paymentMethodChartFilter, setPaymentMethodChartFilter] = useState("");
  const [chartOption, setChartOption] = useState("User");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesRef = firestore.collection("expenses");
        const snapshot = await expensesRef.get();
        const expensesData = snapshot.docs.map((doc) => doc.data());
        setExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const filterExpenses = () => {
    let filteredData = expenses;

    if (chartOption === "User" && userChartFilter !== "") {
      filteredData = filteredData.filter(
        (expense) => expense.user === userChartFilter
      );
    }

    if (chartOption === "Category" && categoryChartFilter !== "") {
      filteredData = filteredData.filter(
        (expense) => expense.category === categoryChartFilter
      );
    }

    if (chartOption === "PaymentMethod" && paymentMethodChartFilter !== "") {
      filteredData = filteredData.filter(
        (expense) => expense.paymentMethod === paymentMethodChartFilter
      );
    }

    return filteredData;
  };

  const getFilteredExpenses = filterExpenses();

  // Calculate total expenses for each category
  const calculateCategoryTotals = (filteredData) => {
    const categoryTotals = {};

    filteredData.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    return categoryTotals;
  };
  // Get unique values for filtering options
  const getUsers = () => [...new Set(expenses.map((expense) => expense.user))];
  const getCategories = () => [
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  const getPaymentMethods = () => [
    ...new Set(expenses.map((expense) => expense.paymentMethod)),
  ];
  const userCategoryTotals = calculateCategoryTotals(getFilteredExpenses);
  const categoryTotals = calculateCategoryTotals(getFilteredExpenses);
  const paymentMethodTotals = calculateCategoryTotals(getFilteredExpenses);

  // Prepare data for the pie charts
  const userCategoryChartData = {
    series: Object.values(userCategoryTotals),
    options: {
      labels: Object.keys(userCategoryTotals),
      colors: [
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
  };

  const categoryChartData = {
    series: Object.values(categoryTotals),
    options: {
      labels: Object.keys(categoryTotals),
      colors: [
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
  };

  // const paymentMethodChartData = {
  //   series: Object.values(paymentMethodTotals),
  //   options: {
  //     labels: Object.keys(paymentMethodTotals),
  //     colors: [
  //       "#FF6384",
  //       "FF6384",
  //       "#36A2EB",
  //       "#FFCE56",
  //       "#FF8A80",
  //       "#B9F6CA",
  //       "#FFD180",
  //       "#64B5F6",
  //       "#E6EE9C",
  //     ],
  //   },
  // };

  const paymentMethodChartData = {
    series: [{ data: Object.values(paymentMethodTotals) }],
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: Object.keys(paymentMethodTotals),
      },
    },
  };

  return (
    <div>
      <label htmlFor="chartOption">Chart Option:</label>
      <select
        id="chartOption"
        onChange={(e) => setChartOption(e.target.value)}
        value={chartOption}
      >
        <option value="User">User</option>
        <option value="Category">Category</option>
        <option value="PaymentMethod">Payment Method</option>
      </select>

      {chartOption === "User" && (
        <div>
          <h3>User Category Totals</h3>
          <select
            id="userChartFilter"
            onChange={(e) => setUserChartFilter(e.target.value)}
            value={userChartFilter}
          >
            <option value="">All</option>
            {getUsers().map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <ApexCharts
            options={userCategoryChartData.options}
            series={userCategoryChartData.series}
            type="pie"
            width="500"
          />
        </div>
      )}
      {chartOption === "Category" && (
        <div>
          <h3>Category Totals</h3>
          <select
            id="categoryChartFilter"
            onChange={(e) => setCategoryChartFilter(e.target.value)}
            value={categoryChartFilter}
          >
            <option value="">All</option>
            {getCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ApexCharts
            options={categoryChartData.options}
            series={categoryChartData.series}
            type="pie"
            width="500"
          />
        </div>
      )}
      {chartOption === "PaymentMethod" && (
        <div>
          <h3>Payment Method Totals</h3>
          {typeof window !== "undefined" && ( // Check if window object is defined
            <ApexCharts
              options={paymentMethodChartData.options}
              series={paymentMethodChartData.series}
              type="bar"
              width="500"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
