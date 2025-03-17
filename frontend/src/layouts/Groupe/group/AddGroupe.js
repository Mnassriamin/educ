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

export default function AddEditJournal({ open, onClose, fetchSocietes, journal }) {
  const [form, setForm] = useState(journal || { name: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    console.log(form);
    try {
      if (journal) {
        await axios.put(`http://localhost:5000/groupe/${journal._id}`, form);
      } else {
        await axios.post("http://localhost:5000/groupe", form);
      }
      fetchSocietes();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{journal ? "Modifier Groupe" : "Ajouter Groupe"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Libelle Groupe"
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
  fetchSocietes: PropTypes.func.isRequired,
  journal: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
};
