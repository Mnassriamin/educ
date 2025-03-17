import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEleve = () => {
  const navigate = useNavigate();

  // Retrieve values from localStorage (set during login)
  const storedUserId = localStorage.getItem("userId");
  // Use 'role' instead of 'userType'
  const storedUserRole = localStorage.getItem("role");

  // Declare all hooks unconditionally
  const [authChecked, setAuthChecked] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    classId: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check authentication status once on mount.
  useEffect(() => {
    console.log("Stored userId:", storedUserId, "Stored role:", storedUserRole);
    // Check if the logged-in user is a parent
    if (!storedUserId || storedUserRole !== "parent") {
      navigate("/login");
    } else {
      setAuthChecked(true);
    }
  }, [storedUserId, storedUserRole, navigate]);

  // Fetch available classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/classes");
        setClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a new eleve
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.classId) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const payload = {
        name: formData.name,
        age: formData.age,
        classId: formData.classId,
        parentId: storedUserId,
      };
      // Ensure the endpoint URL matches your Eleve creation route
      const response = await axios.post("http://localhost:5000/create", payload);
      setMessage(response.data.message || "Eleve created successfully!");
      setError("");
      setFormData({ name: "", age: "", classId: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create eleve.");
      setMessage("");
    }
  };

  // Show a loading indicator until authentication is verified
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  // Inline styles for a modern look
  const containerStyle = {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2>Create Eleve</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ fontWeight: "bold" }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Class:</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={buttonStyle}>
          Create Eleve
        </button>
      </form>
    </div>
  );
};

export default CreateEleve;
