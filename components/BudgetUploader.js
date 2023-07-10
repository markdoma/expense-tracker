import React from "react";
// import { db } from "your-firebase-config"; // Replace with your Firebase configuration
import jsonData from "../utils/budget.json";

import { firestore } from "../utils/firebase";

const BudgetUploader = () => {
  const handleUpload = () => {
    const collectionRef = firestore.collection("budget");

    jsonData.forEach((data) => {
      const docRef = collectionRef.doc();
      docRef
        .set(data)
        .then(() => {
          console.log("Document uploaded successfully.");
        })
        .catch((error) => {
          console.error("Error uploading document:", error);
        });
    });
  };

  return (
    <div>
      <button onClick={handleUpload}>Upload Budget</button>
    </div>
  );
};

export default BudgetUploader;
