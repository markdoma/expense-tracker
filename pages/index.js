import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import React, { useContext } from "react";
import { ExpenseContext } from "../components/context/ExpenseContext";
import Dashboard from "../components/dashboard";

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
  { name: "Parameters", href: "/parameters", current: false },
];
const userNavigation = [
  { name: "Home", href: "#" },
  { name: "Expenses", href: "/expense" },
  { name: "Parameters", href: "/parameters" },
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

  const paymentMethods = ["gcash", "maya", "cash", "bank transfer"];
  const categories = [
    "load",
    "transportation",
    "bills",
    "others",
    "donation",
    "food",
    "travel",
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

  const handleEditExpense = (expenseId) => {
    const expenseToEdit = expenses.find((expense) => expense.id === expenseId);
    if (expenseToEdit) {
      setFormData(expenseToEdit);
      // Set form field values using setValue
      Object.entries(expenseToEdit).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
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
                  {/* Logo */}
                  {/* <div className="absolute left-0 flex-shrink-0 lg:static">
                    <a href="#">
                      <span className="sr-only">Your Company</span>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                        alt="Your Company"
                      />
                    </a>
                  </div> */}

                  {/* Right section on desktop */}
                  <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                    {/* <button
                      type="button"
                      className="flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        {/* <Menu.Button className="flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </Menu.Button> */}
                      </div>
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

                  {/* Search */}
                  {/* <div className="min-w-0 flex-1 px-12 lg:hidden">
                    <div className="mx-auto w-full max-w-xs">
                      <label htmlFor="desktop-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative text-white focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="desktop-search"
                          className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                          placeholder="Search"
                          type="search"
                          name="search"
                        />
                      </div>
                    </div>
                  </div> */}
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
                    <div>
                      {/* <div className="mx-auto w-full max-w-md">
                        <label htmlFor="mobile-search" className="sr-only">
                          Search
                        </label>
                        <div className="relative text-white focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="mobile-search"
                            className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                            placeholder="Search"
                            type="search"
                            name="search"
                          />
                        </div>
                      </div> */}
                    </div>
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
                          {/* <div className="mt-3 space-y-1 px-2">
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Home
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Profile
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Resources
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Company Directory
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Openings
                            </a>
                          </div> */}
                        </div>
                        <div className="pb-2 pt-4">
                          {/* <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                              <div className="truncate text-base font-medium text-gray-800">
                                {user.name}
                              </div>
                              <div className="truncate text-sm font-medium text-gray-500">
                                {user.email}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <span className="sr-only">
                                View notifications
                              </span>
                              <BellIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div> */}
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
                            htmlFor="item"
                          >
                            Item:
                          </label>
                          <input
                            {...register("item", { required: true })}
                            id="item"
                            className="border p-2 w-full"
                            defaultValue={formData.item}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block font-bold mb-2"
                            htmlFor="description"
                          >
                            Description:
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
                      <Dashboard />
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
