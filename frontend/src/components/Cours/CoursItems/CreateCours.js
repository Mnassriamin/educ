// CreateCours.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateCours() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // e.g., "enseignant"
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    matiere: "",
    datedebut: "",
    datefin: "",
  });
  const [error, setError] = useState("");
  const [matieres, setMatieres] = useState([]);

  // Fetch the list of matieres from the backend
  useEffect(() => {
    async function fetchMatieres() {
      try {
        const res = await fetch("http://localhost:5000/api/matieres");
        if (!res.ok) throw new Error("Erreur lors de la récupération des matières");
        const data = await res.json();
        setMatieres(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }
    fetchMatieres();
  }, []);

  // Only authorized users (enseignant) can create courses
  if (userRole !== "enseignant") {
    return <div>Vous n'êtes pas autorisé à créer des cours.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coursData = { ...formData, enseignant: userId };
      const res = await fetch("http://localhost:5000/api/cours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coursData),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du cours");
      await res.json();
      navigate("/cours"); // Redirect after creation
    } catch (err) {
      setError(err.message);
    }
  };

  // Inline styling for a nicer look
  const containerStyle = {
    margin: "2rem auto",
    padding: "2rem",
    maxWidth: "500px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginTop: "1rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1.5rem",
    display: "block",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center" }}>Créer un Cours</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Nom :</label>
          <input
            style={inputStyle}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Matière :</label>
          <select
            style={inputStyle}
            name="matiere"
            value={formData.matiere}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionnez une matière --</option>
            {matieres.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date début :</label>
          <input
            style={inputStyle}
            type="date"
            name="datedebut"
            value={formData.datedebut}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Date fin :</label>
          <input
            style={inputStyle}
            type="date"
            name="datefin"
            value={formData.datefin}
            onChange={handleChange}
            required
          />
        </div>
        <button style={buttonStyle} type="submit">
          Créer le cours
        </button>
      </form>
    </div>
  );
}

export default CreateCours;
