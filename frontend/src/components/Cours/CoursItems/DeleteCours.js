// DeleteCours.js
import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DeleteCours() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Wrap handleDelete in useCallback so its reference remains stable
  const handleDelete = useCallback(async () => {
    if (!window.confirm("Confirmez-vous la suppression de ce cours ?")) {
      navigate("/cours");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cours/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du cours");
      alert("Cours supprimé avec succès");
      navigate("/cours");
    } catch (err) {
      alert(err.message);
    }
  }, [id, navigate]);

  useEffect(() => {
    handleDelete();
  }, [handleDelete]);

  return <p>Suppression en cours...</p>;
}

export default DeleteCours;
