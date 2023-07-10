import { useEffect, useState, Fragment } from "react";
import dynamic from "next/dynamic";

import { Menu, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { firestore } from "../utils/firebase";

import Link from "next/link";

// Import ApexCharts dynamically to prevent server-side rendering issues
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Expenses", href: "/expense", current: false },
    { name: "Dashboard", href: "/dashboard", current: false },
  ];
  const userNavigation = [
    { name: "Home", href: "/" },
    { name: "Expenses", href: "/expense" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const [expenses, setExpenses] = useState([]);
  const [userFilter, setUserFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");

  const [userChartFilter, setUserChartFilter] = useState("");
  const [categoryChartFilter, setCategoryChartFilter] = useState("");
  const [paymentMethodChartFilter, setPaymentMethodChartFilter] = useState("");
  const [chartOption, setChartOption] = useState("User");

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

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

  // Calculate total expenses for each user
  const calculateUserTotals = (filteredData) => {
    const userTotals = {};

    filteredData.forEach((expense) => {
      if (userTotals[expense.user]) {
        userTotals[expense.user] += expense.amount;
      } else {
        userTotals[expense.user] = expense.amount;
      }
    });

    return userTotals;
  };

  // Calculate total expenses for each user
  const calculatePaymentMethodTotals = (filteredData) => {
    const paymentTotals = {};

    filteredData.forEach((expense) => {
      if (paymentTotals[expense.paymentMethod]) {
        paymentTotals[expense.paymentMethod] += expense.amount;
      } else {
        paymentTotals[expense.paymentMethod] = expense.amount;
      }
    });

    return paymentTotals;
  };
  // Get unique values for filtering options
  const getUsers = () => [...new Set(expenses.map((expense) => expense.user))];
  const getCategories = () => [
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  const getPaymentMethods = () => [
    ...new Set(expenses.map((expense) => expense.paymentMethod)),
  ];
  const userCategoryTotals = calculateUserTotals(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);
  const paymentMethodTotals = calculatePaymentMethodTotals(expenses);

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

  const paymentMethodChartData = {
    series: Object.values(paymentMethodTotals),
    options: {
      labels: Object.keys(paymentMethodTotals),
      colors: [
        "#FF6384",
        "FF6384",
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
  //   series: [{ data: Object.values(paymentMethodTotals) }],
  //   options: {
  //     chart: {
  //       type: "bar",
  //     },
  //     xaxis: {
  //       categories: Object.keys(paymentMethodTotals),
  //     },
  //   },
  // };

  return (
    // </div>\

    <>
      <div className="min-h-full">
        <Popover as="header" className="bg-indigo-600 pb-24">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                {/* Right section on desktop */}
                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div></div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    // onClick={handleUserToggle}
                  >
                    Dashboard
                  </button>
                </div>

                <div className="absolute right-0 flex-shrink-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>

                <div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
                  <div className="grid grid-cols-3 items-center gap-8">
                    <div className="col-span-2">
                      <nav className="flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current ? "text-white" : "text-indigo-100",
                              "rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div className="lg:hidden">
                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel
                      focus
                      className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                    >
                      <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="pb-2 pt-3">
                          <div className="flex items-center justify-between px-4">
                            <div>
                              {/* <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                          alt="Your Company"
                        /> */}
                            </div>
                            <div className="-mr-2">
                              <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </Popover.Button>
                            </div>
                          </div>
                        </div>
                        <div className="pb-2 pt-4">
                          <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </>
          )}
        </Popover>
        <main className="mt-24 pb-8 flex items-start justify-center">
          <div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                {/* <h3>User Totals</h3> */}
                <ApexCharts
                  options={{
                    ...userCategoryChartData.options,
                    legend: {
                      show: false,
                    },
                  }}
                  series={userCategoryChartData.series}
                  type="pie"
                  width="100%"
                />
                <h2 className="text-center font-bold mt-4">User</h2>
              </div>
              <div>
                {/* <h3>Category Totals</h3> */}
                <ApexCharts
                  options={{
                    ...categoryChartData.options,
                    legend: {
                      show: false,
                    },
                  }}
                  series={categoryChartData.series}
                  type="pie"
                  width="100%"
                />
                <h2 className="text-center font-bold mt-4">Category</h2>
              </div>
              <div className="sm:col-span-2">
                {/* <h3>Payment Method Totals</h3> */}
                <ApexCharts
                  options={{
                    ...paymentMethodChartData.options,
                    legend: {
                      show: false,
                    },
                  }}
                  series={paymentMethodChartData.series}
                  type="pie"
                  width="100%"
                />
                <h2 className="text-center font-bold mt-4">Payment Method</h2>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left"></div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
