import React from "react";
import AddStudentForm from "./AddStudentForm";

const AddStudentPage: React.FC = () => {
  // Retrieve the prof’s ID from localStorage (assuming you stored it there after login)
  const profId = localStorage.getItem("userId") || "";

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Add Students Page</h1>
      <AddStudentForm profId={profId} />
    </div>
  );
};

export default AddStudentPage;
