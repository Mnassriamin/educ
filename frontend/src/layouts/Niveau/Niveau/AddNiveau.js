import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function AddEditCompte({ open, onClose, fetchComptes, compte }) {
  const [form, setForm] = useState(compte || { name: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    console.log(compte);
    if (compte) {
      setForm({
        name: compte.name || "",
      });
    } else {
      setForm({
        name: "",
      });
    }
  }, [compte]);

  const handleSubmit = async () => {
    try {
      if (compte) {
        await axios.put(`http://localhost:5000/niveau/${compte._id}`, form);
      } else {
        await axios.post("http://localhost:5000/niveau", form);
      }
      fetchComptes();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{compte ? "Modifier Niveau" : "Ajouter Niveau"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Libelle Niveau"
          name="name"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddEditCompte.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchComptes: PropTypes.func.isRequired,
  compte: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
};
