import { useState, useContext } from "react";
import Link from "next/link";
import { ExpenseContext } from "../components/context/ExpenseContext";

const ParametersPage = () => {
  const {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    categories,
    addCategory,
    removeCategory,
    setPaymentMethods,
    setCategories,
  } = useContext(ExpenseContext);

  const handlePaymentMethodChange = (index, value) => {
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods[index] = value;
    setPaymentMethods(updatedPaymentMethods);
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  const addPaymentMethod1 = () => {
    addPaymentMethod("");
  };

  const addCategory1 = () => {
    addCategory("");
  };

  const removePaymentMethod1 = (index) => {
    removePaymentMethod(index);
  };

  const removeCategory1 = (index) => {
    removeCategory(index);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/expense">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Expense Tracker
        </button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
      {paymentMethods.map((method, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            className="border p-2 mr-2"
            value={method}
            onChange={(e) => handlePaymentMethodChange(index, e.target.value)}
          />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removePaymentMethod1(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4.rounded mt-4"
        onClick={addPaymentMethod1}
      >
        Add Payment Method
      </button>

      <h1 className="text-2xl font-bold my-4">Categories</h1>
      {categories.map((category, index) => (
        <div key={index} className="flex mb-2">
          <input
            type="text"
            className="border p-2 mr-2"
            value={category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
          />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeCategory1(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={addCategory1}
      >
        Add Category
      </button>
    </div>
  );
};

export default ParametersPage;
