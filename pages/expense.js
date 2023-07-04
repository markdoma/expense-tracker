import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import React, { useContext } from "react";
import { ExpenseContext } from "../components/context/ExpenseContext";
import Dashboard from "../components/dashboard";
import Link from "next/link";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrxXctvYEQIl75mtDWoP0ApIIj77YpInw",
  authDomain: "doma-exp-tracker.firebaseapp.com",
  projectId: "doma-exp-tracker",
  storageBucket: "doma-exp-tracker.appspot.com",
  messagingSenderId: "690741063724",
  appId: "1:690741063724:web:c4d7db00b56966a1052189",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Create a Firestore instance
const firestore = firebase.firestore();

// const defaultExpenses = [
//   {
//     id: uuid(),
//     date: "2023-07-01",
//     item: "Item 1",
//     description: "Description 1",
//     paymentMethod: "gcash",
//     category: "Category 1",
//     amount: 100,
//     user: "Mark",
//   },
//   {
//     id: uuid(),
//     date: "2023-07-02",
//     item: "Item 2",
//     description: "Description 2",
//     paymentMethod: "cash",
//     category: "Category 2",
//     amount: 200,
//     user: "Jeanne",
//   },
// ];

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

  // const [expenses, setExpenses] = useState(defaultExpenses);
  const [formData, setFormData] = useState(defaultFormData);
  const [user, setUser] = useState("Mark");
  const { register, handleSubmit, reset, setValue } = useForm();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleUserToggle}
        >
          {user}
        </button>
        <Link href="/parameters">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Parameters
          </button>
        </Link>
        {/* <Link href="/dashboard">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Dashboard
          </button>
        </Link> */}
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4">
        <input type="hidden" {...register("id")} value={formData.id} />

        <label className="block mb-2">
          Item:
          <input
            {...register("item", { required: true })}
            className="border p-2"
            defaultValue={formData.item}
          />
        </label>
        <br />
        <label className="block mb-2">
          Description:
          <input
            {...register("description", { required: true })}
            className="border p-2"
            defaultValue={formData.description}
          />
        </label>
        <br />
        <label className="block mb-2">
          Payment Method:
          <select
            {...register("paymentMethod")}
            className="border p-2"
            defaultValue={formData.paymentMethod}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className="block mb-2">
          Category:
          <select
            {...register("category", { required: true })}
            className="border p-2"
            defaultValue={formData.category}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className="block mb-2">
          Amount:
          <input
            {...register("amount", {
              pattern: /^[0-9]+$/i,
              valueAsNumber: true,
              required: true,
            })}
            className="border p-2"
            defaultValue={formData.amount}
          />
        </label>
        <br />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {formData.id ? "Update Expense" : "Add Expense"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Clear
        </button>
      </form>

      <table className="border-collapse border w-full">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Item</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Payment Method</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="border p-2">{expense.date}</td>
              <td className="border p-2">{expense.item}</td>
              <td className="border p-2">{expense.description}</td>
              <td className="border p-2">{expense.paymentMethod}</td>
              <td className="border p-2">{expense.category}</td>
              <td className="border p-2">{expense.amount}</td>
              <td className="border p-2">{expense.user}</td>
              <td className="border p-2">
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

      {/* Pass the expenses data to the Dashboard component */}
      {/* <Dashboard expenses={expenses} /> */}
    </div>
  );
}
