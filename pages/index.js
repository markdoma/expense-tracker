import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import React, { useContext } from "react";
import { ExpenseContext } from "../components/context/ExpenseContext";
import BudgetComponent from "../components/BudgetComponent";
import BudgetUploader from "../components/BudgetUploader";

import { firestore } from "../utils/firebase";

import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

import Modal from "../components/Modal";

import Link from "next/link";

const defaultFormData = {
  id: "",
  date: "",
  item: "",
  description: "",
  paymentMethod: "gcash",
  category: "",
  amount: "",
  user: "Mark",
};

const user = {
  name: "Mark Doma",
  email: "markdoma0510@gmail.com",
};
const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Expenses", href: "/expense", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
];
const userNavigation = [
  { name: "Home", href: "#" },
  { name: "Expenses", href: "/expense" },
  { name: "Dashboard", href: "/dashboard" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("expenses")
      .onSnapshot((snapshot) => {
        const fetchedExpenses = snapshot.docs.map((doc) => doc.data());
        setExpenses(fetchedExpenses);
      });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const paymentMethods = ["gcash", "maya", "cash", "lbp", "ub", "bpi", "tonik"];
  const categories = [
    "Airbnb",
    "Airfare",
    "Bus Fare",
    "Car expenses",
    "Charity",
    "Church",
    "Clothing",
    "Commute Fare",
    "Daily Allowance_Jeanne",
    "Daily Allowance_Mark",
    "Date  (Elle & Biboy)",
    "Date  (Mark & Jeanne)",
    "Dates (Mama)",
    "Diesel",
    "Doctor/Dentist",
    "Drinking Water",
    "Emergency Fund",
    "Emergency",
    "Entertainment",
    "First Metro Securities",
    "Food (home)",
    "Food (Weekend)",
    "Food(weeked food * 3(breakfast+lunch+dinner))",
    "Gifts(Christmas,birthday) Cake",
    "Globe",
    "Groceries/Marketing",
    "Haircut",
    "HOA Dues",
    "Kumon",
    "LNP Tithes",
    "Load_Jeanne",
    "Load_Mark",
    "Loan to people",
    "LPG",
    "Medicine/Drugs",
    "Meralco Bill",
    "Mom and Dad, Mama",
    "MWG Food",
    "Other- Pasalubong/Souvenirs",
    "Others - Misc",
    "Parking Fee",
    "Pru Life",
    "Rabi's Food",
    "Repairs and Maintenance",
    "Salaries Exp",
    "School Supplies",
    "SSS",
    "Sunlife",
    "Tip",
    "Toll Fee Cash",
    "Toys / Pasalubong - Kids",
    "Tuition Elle & Biboy",
    "Tuition Jeanne",
    "UITF",
    "Water Bill",
  ];

  // const { paymentMethods, categories } = useContext(ExpenseContext);

  // const [expenses, setExpenses] = useState(defaultExpenses);
  const [formData, setFormData] = useState(defaultFormData);
  const [user, setUser] = useState("Mark");
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showModal, setShowModal] = useState(false);
  const handleFormSubmit = async (data) => {
    console.log(data);
    if (data.id) {
      // Update existing expense
      await firestore.collection("expenses").doc(data.id).update(data);
    } else {
      // Add new expense
      const newExpense = {
        id: uuid(),
        date: new Date().toISOString().split("T")[0],
        ...data,
        user: user,
      };

      // await firestore.collection("expenses").doc(newExpense.id).set(newExpense);
      await firestore.collection("expenses").doc().set(newExpense);
      // Show the modal
      setShowModal(true);
    }

    resetForm();
  };

  const handleDeleteExpense = async (expenseId) => {
    await firestore.collection("expenses").doc(expenseId).delete();
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    reset();
  };

  const handleUserToggle = () => {
    setUser((prevUser) => (prevUser === "Mark" ? "Jeanne" : "Mark"));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="min-h-full">
        <Popover as="header" className="bg-indigo-600 pb-24">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative flex items-center justify-center py-5 lg:justify-between">
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
                  </div>
                  {/* Only when updating the Budget */}
                  {/* <BudgetUploader /> */}
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={handleUserToggle}
                  >
                    {user}
                  </button>

                  {/* Menu button */}
                  <div className="absolute right-0 flex-shrink-0 lg:hidden">
                    {/* Mobile menu button */}
                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Popover.Button>
                  </div>
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
        <main className="-mt-24 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-1">
                <section aria-labelledby="section-1-title">
                  <h2 className="sr-only" id="section-1-title">
                    Section title
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="mb-4"
                      >
                        <input
                          type="hidden"
                          {...register("id")}
                          value={formData.id}
                        />

                        <div className="mb-4">
                          <label
                            className="block font-bold mb-2"
                            htmlFor="details"
                          >
                            Details:
                          </label>
                          <input
                            {...register("description", { required: true })}
                            id="description"
                            className="border p-2 w-full"
                            defaultValue={formData.description}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block font-bold mb-2"
                            htmlFor="paymentMethod"
                          >
                            Payment Method:
                          </label>
                          <select
                            {...register("paymentMethod")}
                            id="paymentMethod"
                            className="border p-2 w-full"
                            defaultValue={formData.paymentMethod}
                          >
                            {paymentMethods.map((method) => (
                              <option key={method} value={method}>
                                {method.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label
                            className="block font-bold mb-2"
                            htmlFor="category"
                          >
                            Category:
                          </label>
                          <select
                            {...register("category", { required: true })}
                            id="category"
                            className="border p-2 w-full"
                            defaultValue={formData.category}
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label
                            className="block font-bold mb-2"
                            htmlFor="amount"
                          >
                            Amount:
                          </label>
                          <input
                            {...register("amount", {
                              pattern: /^[0-9]+$/i,
                              valueAsNumber: true,
                              required: true,
                            })}
                            id="amount"
                            className="border p-2 w-full"
                            defaultValue={formData.amount}
                          />
                        </div>

                        <div className="flex">
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                          >
                            {formData.id ? "Update Expense" : "Add Expense"}
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Clear
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-2-title">
                  <h2 className="sr-only" id="section-2-title">
                    Dashboard
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <BudgetComponent />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
          {/* Modal */}
          {showModal && <Modal onClose={closeModal} />}
        </main>
        <footer>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left"></div>
          </div>
        </footer>
      </div>
    </>
  );
}
