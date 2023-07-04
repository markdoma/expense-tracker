import React, { createContext, useState } from "react";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const defaultPaymentMethods = ["gcash"];
  const defaultCategories = ["load"];
  const [paymentMethods, setPaymentMethods] = useState(defaultPaymentMethods);
  const [categories, setCategories] = useState(defaultCategories);

  const addPaymentMethod = (method) => {
    setPaymentMethods((prevMethods) => [...prevMethods, method]);
  };

  const removePaymentMethod = (index) => {
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods.splice(index, 1);
    setPaymentMethods(updatedPaymentMethods);
  };

  const addCategory = (category) => {
    setCategories((prevCategories) => [...prevCategories, category]);
  };

  const removeCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
  };

  return (
    <ExpenseContext.Provider
      value={{
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        categories,
        addCategory,
        removeCategory,
        setPaymentMethods,
        setCategories,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
