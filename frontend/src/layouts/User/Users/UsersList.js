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
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Add, Edit, Delete, Print, FileDownload, Business } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import AddEditUser from "./AddEditUser";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [setOpenAffectDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page] = useState(0);
  const [rowsPerPage] = useState(4);
  const [loading] = useState(false); // Indicateur de chargement
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur

  // Récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/api/users", {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
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
    doc.text("Liste des Utilisateurs", 14, 20);
    const headers = ["Nom", "Raison Sociale", "Téléphone", "Email", "Rôle"];
    const rows = users.map((user) => [
      user.name,
      user.raisonSociale,
      user.telephone,
      user.email,
      user.role,
    ]);
    doc.autoTable({ head: [headers], body: rows, startY: 30 });
    doc.save("utilisateurs.pdf");
  };

  const handleExportExcel = () => {
    const exportData = users.map((user) => ({
      Nom: user.name,
      "Raison Sociale": user.raisonSociale,
      Téléphone: user.telephone,
      Email: user.email,
      Rôle: user.role,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "utilisateurs");
    XLSX.writeFile(wb, "utilisateurs.xlsx");
  };

  const handleOpenAffectDialog = (user) => {
    setSelectedUser(user);
    setOpenAffectDialog(true);
  };

  useEffect(() => {
    fetchUsers();
  });

  return (
    <Container sx={{ backgroundColor: "#f6f2f1", padding: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 15, color: "#333" }}>
        Liste des Utilisateurs
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Ajouter un Utilisateur
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
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  {/* Affichage de l'image de l'utilisateur */}

                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user._id)}>
                      <Delete />
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
