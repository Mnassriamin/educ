import React, { useState } from "react";
import axios from "axios";

interface Props {
  profId: string; // The logged-in prof’s ID (obtained from localStorage or your global state)
}

const AddStudentForm: React.FC<Props> = ({ profId }) => {
  const [enfantId, setEnfantId] = useState("");
  const [enfantName, setEnfantName] = useState("");

  // Retrieve token from localStorage
  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert("You must be logged in as a prof to add students.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profs/${profId}/assignStudent`,
        {
          enfantId,
          enfantName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Student assigned:", response.data);
      alert(`Student '${enfantName}' added successfully!`);
      // Optionally reset fields or do other UI updates
      setEnfantId("");
      setEnfantName("");
    } catch (error: any) {
      console.error("Error assigning student:", error.response?.data || error.message);
      alert("Failed to add student. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Student to Logged-In Prof</h3>

      <div>
        <label>Enfant ID:</label>
        <input
          type="text"
          value={enfantId}
          onChange={(e) => setEnfantId(e.target.value)}
          placeholder="603d7e24f1c8b855ae4f9b38"
          required
        />
      </div>

      <div>
        <label>Enfant Name:</label>
        <input
          type="text"
          value={enfantName}
          onChange={(e) => setEnfantName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <button type="submit">Add Student</button>
    </form>
  );
};

export default AddStudentForm;
