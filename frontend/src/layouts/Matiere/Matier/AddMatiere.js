import React, { useState } from "react";
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

export default function AddEditJournal({ open, onClose, fetchComptes, compte }) {
  const [form, setForm] = useState(compte || { name: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (compte) {
        await axios.put(`http://localhost:5000/matiere/${compte._id}`, form);
      } else {
        await axios.post("http://localhost:5000/matiere", form);
      }
      fetchComptes();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{compte ? "Modifier Matiere" : "Ajouter Matiere"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Libelle Matiere"
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

AddEditJournal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchComptes: PropTypes.func.isRequired,
  compte: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
};
