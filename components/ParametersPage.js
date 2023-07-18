import { useState, useEffect, useContext } from "react";
import Link from "next/link";
// import firebase from "firebase/app";
// import "firebase/firestore";
import { ExpenseContext } from "../components/context/ExpenseContext";

import { firebase, firestore } from "../utils/firebase";

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

  // Firebase Firestore reference
  // const firestore = firebase.firestore();

  useEffect(() => {
    // Fetch payment methods from Firestore
    const fetchPaymentMethods = async () => {
      try {
        const paymentMethodsSnapshot = await firestore
          .collection("paymentMethods")
          .get();
        const paymentMethodsData = paymentMethodsSnapshot.docs.map(
          (doc) => doc.data().name
        );
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    // Fetch categories from Firestore
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await firestore
          .collection("categories")
          .get();
        const categoriesData = categoriesSnapshot.docs.map(
          (doc) => doc.data().name
        );
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchPaymentMethods();
    fetchCategories();
  }, []);

  const handlePaymentMethodChange = (index, value) => {
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods[index] = value;
    setPaymentMethods(updatedPaymentMethods);

    // Update payment method in Firestore
    const paymentMethodsRef = firestore.collection("paymentMethods");
    const paymentMethodDocRef = paymentMethodsRef.doc(index.toString());
    paymentMethodDocRef
      .update({ name: value })
      .catch((error) => console.error("Error updating payment method:", error));
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);

    // Update category in Firestore
    const categoriesRef = firestore.collection("categories");
    const categoryDocRef = categoriesRef.doc(index.toString());
    categoryDocRef
      .update({ name: value })
      .catch((error) => console.error("Error updating category:", error));
  };

  const addPaymentMethod1 = () => {
    addPaymentMethod("");
  };

  const addCategory1 = () => {
    addCategory("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <Link href="/expense">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Expense Tracker
            </button>
          </Link>
          <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
        </div>
      </div>
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="mb-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="border p-2 mr-2"
                value={method}
                onChange={(e) =>
                  handlePaymentMethodChange(index, e.target.value)
                }
              />
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => removePaymentMethod1(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={addPaymentMethod1}
        >
          Add Payment Method
        </button>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold my-4">Categories</h1>
        </div>
      </div>
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="mb-4">
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
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={addCategory1}
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default ParametersPage;
