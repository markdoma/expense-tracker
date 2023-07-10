import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { firestore } from "../utils/firebase";

import React, { useContext } from "react";
import { ExpenseContext } from "../components/context/ExpenseContext";
import Dashboard from "../components/dashboard";
import Link from "next/link";

import { PlusSmallIcon } from "@heroicons/react/20/solid";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// const firestore = firebase.firestore();

export default function ExpenseTracker() {
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

  const { paymentMethods, categories } = useContext(ExpenseContext);

  const { register, handleSubmit, reset, setValue } = useForm();

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

  const [numberOfDays, setNumberOfDays] = useState(7); // Initialize numberOfDays with a default value of 7

  const handleFilter = (days) => {
    setNumberOfDays(days); // Update numberOfDays based on the button clicked
  };

  const currentDate = new Date(); // Get the current date

  const filteredExpenses = expenses
    .filter((expense) => {
      if (numberOfDays === 0) {
        return true; // Return all expenses for All-time
      }
      const expenseDate = new Date(expense.date);
      const diffInTime = currentDate.getTime() - expenseDate.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)); // Calculate the difference in days
      return diffInDays <= numberOfDays; // Filter expenses within the specified number of days
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Expenses
          </h1>
          <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
            <button onClick={() => handleFilter(7)} className="text-indigo-600">
              Last 7 days
            </button>
            <button onClick={() => handleFilter(30)} className="text-gray-700">
              Last 30 days
            </button>
            <button onClick={() => handleFilter(0)} className="text-gray-700">
              All-time
            </button>
          </div>
          <Link
            href="/"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusSmallIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            New expense
          </Link>
        </div>
      </div>
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="whitespace-nowrap py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0 border p-2"
              >
                Date
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900 border p-2"
              >
                Item
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900 border p-2"
              >
                Description
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900 border p-2"
              >
                Payment Method
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900 border p-2"
              >
                Category
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900 border p-2"
              >
                Amount
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900 border p-2"
              >
                User
              </th>
              <th
                scope="col"
                className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0 border p-2"
              >
                Action
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td className="whitespace-nowrap py-2 text-center pl-4 pr-3 text-sm text-gray-500 sm:pl-0 border p-2">
                  {expense.date}
                </td>
                <td className="whitespace-nowrap px-2 text-center py-2 text-sm font-medium text-gray-900 border p-2">
                  {expense.item}
                </td>
                <td className="whitespace-nowrap px-2 text-center py-2 text-sm text-gray-900 border p-2">
                  {expense.description}
                </td>
                <td className="whitespace-nowrap px-2 text-center py-2 text-sm text-gray-900 border p-2">
                  {expense.paymentMethod}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-sm text-gray-900 border p-2">
                  {expense.category}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-sm text-gray-900 border p-2">
                  {expense.amount}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-sm text-gray-900 border p-2">
                  {expense.user}
                </td>
                <td className="relative whitespace-nowrap py-2 text-center pl-3 pr-4 text-right text-sm font-medium sm:pr-0 border p-2 flex justify-center">
                  <button
                    onClick={() => handleEditExpense(expense.id)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
