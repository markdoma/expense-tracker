import { useState, useEffect } from "react";
import Link from "next/link";
import { firebase, firestore } from "../utils/firebase";

const ParametersPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const addPaymentMethod = async () => {
    const newPaymentMethod = "";
    const paymentMethodsRef = firestore.collection("paymentMethods");
    try {
      const docRef = await paymentMethodsRef.add({ name: newPaymentMethod });
      setPaymentMethods((prevPaymentMethods) => [
        ...prevPaymentMethods,
        newPaymentMethod,
      ]);
      console.log("Added new payment method with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding payment method:", error);
    }
  };

  const addCategory = async () => {
    const newCategory = "";
    const categoriesRef = firestore.collection("categories");
    try {
      const docRef = await categoriesRef.add({ name: newCategory });
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      console.log("Added new category with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const removePaymentMethod = (index) => {
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods.splice(index, 1);
    setPaymentMethods(updatedPaymentMethods);
  };

  const removeCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
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
                onClick={() => removePaymentMethod(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={addPaymentMethod}
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
                onClick={() => removeCategory(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={addCategory}
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default ParametersPage;
