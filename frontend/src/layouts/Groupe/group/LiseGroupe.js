import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Typography as MuiTypography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Add, Edit, Delete, Print, FileDownload, Business } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import AddEditUser from "./AddGroupe";

export default function GroupeList() {
  const [users, setUsers] = useState([]);
  const [societes, setSocietes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAffectDialog, setOpenAffectDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSociete, setSelectedSociete] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchUsers();
    fetchSocietes();
  }, [page, rowsPerPage]);

  // Récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      //const response = await axios.get("http://localhost:5000/groupe/get");
      const response = await axios.get("http://localhost:5000/groupe/get", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  const fetchSocietes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/users/api/users");
      setSocietes(response.data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des sociétés.");
      console.error("Erreur lors de la récupération des sociétés :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/groupe/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des Groupes", 14, 20);
    const headers = ["Nom"];
    const rows = users.map((user) => [user.name]);
    doc.autoTable({ head: [headers], body: rows, startY: 30 });
    doc.save("Groupe.pdf");
  };

  const handleExportExcel = () => {
    const exportData = users.map((user) => ({
      Nom: user.name,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Groupe");
    XLSX.writeFile(wb, "Groupes.xlsx");
  };

  const handleOpenAffectDialog = (user) => {
    setSelectedUser(user);
    setOpenAffectDialog(true);
  };

  const handleSocieteSelect = (event, societeId) => {
    if (event.target.checked) {
      setSelectedSociete((prev) => [...prev, societeId]);
    } else {
      setSelectedSociete((prev) => prev.filter((id) => id !== societeId));
    }
  };

  const handleAffectUserToSociete = async () => {
    if (!selectedUser || selectedSociete.length === 0) return;

    try {
      await axios.post("http://localhost:5000/api/acces", {
        id_user: selectedUser._id,
        id_societes: selectedSociete, // Envoie un tableau d'IDs de sociétés
      });

      setOpenAffectDialog(false);
      setSelectedSociete([]); // Réinitialiser la sélection
      fetchUsers(); // Rafraîchir la liste des utilisateurs après l'affectation
    } catch (error) {
      setErrorMessage("Erreur lors de l'affectation.");
      console.error("Erreur lors de l'affectation :", error);
    }
  };

  return (
    <Container sx={{ backgroundColor: "#f6f2f1", padding: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 15, color: "#333" }}>
        Liste des Groupes
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Ajouter un Groupe
        </Button>
        <Box>
          <IconButton color="primary" onClick={handlePrintPDF}>
            <Print />
          </IconButton>
          <IconButton color="primary" onClick={handleExportExcel}>
            <FileDownload />
          </IconButton>
        </Box>
      </Box>

      {/* Affichage d'un loader pendant le chargement des utilisateurs */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Colonne pour l'image */}
                <TableCell>Nom</TableCell>

                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  {/* Affichage de l'image de l'utilisateur */}

                  <TableCell>{user.name}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user._id)}>
                      <Delete />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenAffectDialog(user)}>
                      <Business />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Affichage d'un message d'erreur s'il y en a */}
      {errorMessage && (
        <Snackbar
          open={true}
          message={errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
        />
      )}

      <Dialog open={openAffectDialog} onClose={() => setOpenAffectDialog(false)}>
        <DialogTitle>Affecter {selectedUser?.name} à un ou plusieurs Eleves </DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {societes.map((societe) => (
              <Box key={societe._id} sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={selectedSociete.includes(societe._id)}
                  onChange={(e) => handleSocieteSelect(e, societe._id)}
                  name={societe.name}
                />
                <MuiTypography>{societe.name}</MuiTypography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAffectDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAffectUserToSociete}>
            Valider
          </Button>
        </DialogActions>
      </Dialog>

      {openDialog && (
        <AddEditUser
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fetchUsers={fetchUsers}
          user={selectedUser}
        />
      )}
    </Container>
  );
}
