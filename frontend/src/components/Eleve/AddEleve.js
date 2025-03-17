import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";

export default function AddEditJournal({ open, onClose, fetchComptes, compte }) {
  const [form, setForm] = useState(compte || { name: "", niveau: "" });
  const [niveau, setniveau] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    console.log(compte);
    if (compte) {
      setForm({
        name: compte.name,
        niveau: compte.IdNiveau,
      });
    } else {
      setForm({
        name: "",
        niveau: "",
      });
    }
  }, [compte]);

  useEffect(() => {
    const fetchexpiditeur = async () => {
      try {
        const response = await axios.get("http://localhost:5000/niveau/get");
        console.log(response.data);
        const usersWithId = response.data.map((user) => ({
          ...user,
          id: user._id,
        }));
        setniveau(usersWithId);
      } catch (error) {
        console.error("Error fetching Niveau:", error);
      }
    };

    fetchexpiditeur();
  }, []);

  const handleSubmit = async () => {
    try {
      if (compte) {
        await axios.put(`http://localhost:5000/eleve/${compte._id}`, form);
      } else {
        await axios.post("http://localhost:5000/eleve", form);
      }
      fetchComptes();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{compte ? "Modifier Eleve" : "Ajouter Eleve"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Libelle Eleve"
          name="name"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          select
          id="niveau"
          name="niveau"
          margin="dense"
          label="Niveau"
          value={form.niveau}
          fullWidth
          onChange={handleChange}
        >
          <MenuItem value={form.niveau}>Choisir un Niveau</MenuItem>
          {niveau.map((expiditeur) => (
            <MenuItem key={expiditeur.id} value={expiditeur.id}>
              {expiditeur.name}
            </MenuItem>
          ))}
        </TextField>
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
    IdNiveau: PropTypes.string,
  }),
};
