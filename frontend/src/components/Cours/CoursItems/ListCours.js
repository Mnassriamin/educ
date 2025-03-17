// ListCours.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cours.css";

function ListCours() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cours");
        if (!res.ok) throw new Error("Erreur lors de la récupération des cours");
        const data = await res.json();

        // For teachers, filter courses to show only those they created
        const filteredCourses =
          userRole === "enseignant"
            ? data.filter((course) => course.enseignant && course.enseignant._id === userId)
            : data;

        setCourses(filteredCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userRole, userId]);

  const handleEnroll = async (courseId) => {
    try {
      if (!userId) {
        alert("Erreur : ID utilisateur introuvable.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/cours/${courseId}/enroll`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etudiantId: userId }),
      });
      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erreur lors de l'inscription au cours");
      }

      setCourses((prevCourses) =>
        prevCourses.map((course) => (course._id === responseData._id ? responseData : course))
      );

      alert("Inscription réussie !");
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.message);
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/cours/update/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Confirmez-vous la suppression de ce cours ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cours/${courseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du cours");
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      alert("Cours supprimé avec succès");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="cours-container">
      <h1 className="cours-title">Liste des Cours</h1>

      {userRole === "enseignant" && (
        <button className="add-course-btn" onClick={() => navigate("/cours/create")}>
          Ajouter un cours
        </button>
      )}

      {courses.length === 0 ? (
        <p>Aucun cours disponible.</p>
      ) : (
        <ul className="cours-list">
          {courses.map((course) => (
            <li key={course._id} className="cours-item">
              <p>
                <strong>{course.name}</strong>
              </p>
              <p>Matière: {course.matiere?.name || "Nom indisponible"}</p>
              <p>Date début: {new Date(course.datedebut).toLocaleDateString()}</p>
              <p>Date fin: {new Date(course.datefin).toLocaleDateString()}</p>

              {userRole === "enseignant" && course.etudiants && (
                <div className="student-list">
                  <p>
                    <strong>Étudiants inscrits :</strong>
                  </p>
                  <ul>
                    {course.etudiants.length > 0 ? (
                      course.etudiants.map((student) => <li key={student._id}>{student.name}</li>)
                    ) : (
                      <p>Aucun étudiant inscrit</p>
                    )}
                  </ul>
                </div>
              )}

              {userRole !== "enseignant" && !course.etudiants?.some((e) => e._id === userId) && (
                <button className="enroll-btn" onClick={() => handleEnroll(course._id)}>
                  S&apos;inscrire
                </button>
              )}

              {userRole === "enseignant" && (
                <>
                  <button className="edit-btn" onClick={() => handleEdit(course._id)}>
                    Modifier
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(course._id)}>
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListCours;
