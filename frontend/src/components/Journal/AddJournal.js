import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function AddEditJournal({ open, onClose, fetchJournals, journal }) {
  const [form, setForm] = useState(journal || { codejournal: "", libjournal: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (journal) {
        await axios.put(`http://localhost:5000/api/journals/${journal._id}`, form);
      } else {
        await axios.post("http://localhost:5000/api/journals", form);
      }
      fetchJournals();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{journal ? "Modifier Journal" : "Ajouter Journal"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Code journal"
          name="codejournal"
          fullWidth
          value={form.codejournal}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Libellé journal "
          name="libjournal"
          fullWidth
          value={form.libjournal}
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
