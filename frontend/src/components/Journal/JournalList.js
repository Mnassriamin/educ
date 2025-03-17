import React, { useEffect, useState } from "react";
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
  Card,
  CardContent,
  Stack,
  Drawer,
  TextField,
  FormControlLabel,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { Add, Edit, Delete, Print, FileDownload } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Importation de la bibliothèque XLSX

import axios from "axios";
import AddEditJournal from "./AddJournal";

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [page, setPage] = useState(0); // Page actuelle
  const [rowsPerPage, setRowsPerPage] = useState(4); // Nombre d'éléments par page (modifié à 4)

  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchJournals = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/journals", {
        params: {
          page: page + 1, // L'API attend probablement la page en 1-index (pas 0-index)
          limit: rowsPerPage,
        },
      });
      setJournals(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des journals :", error);
    }
  };
  // Déclarer les états
  const [filters, setFilters] = useState({
    numJournal: "",
    libelleJournal: "",
  });
  const [selectedFields, setSelectedFields] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/journals/${id}`);
      fetchJournals();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (journal) => {
    setSelectedJournal(journal);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedJournal(null);
    setOpenDialog(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset à la première page quand on change le nombre d'éléments par page
  };
  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleFieldSelection = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleApplyFilter = () => {
    setOpenFilter(false); // Fermer le drawer après l'application du filtre
  };

  const handleClearFilter = () => {
    setFilters({
      codejournal: "",
      libellejournal: "",
    });
    setSelectedFields([]); // Réinitialiser les champs sélectionnés
  };

  // Fonction pour imprimer en PDF
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Ajouter un titre
    doc.setFontSize(16);
    doc.text("Liste journals", 14, 20);

    // Ajouter les en-têtes de la table
    const headers = ["Code journal", "Libellé"];
    const rows = journals.map((journal) => [journal.codejournal, journal.libjournal]);

    // Ajouter la table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
    });

    // Sauvegarder le PDF
    doc.save("journals.pdf");
  };

  // Fonction pour exporter en Excel
  const handleExportExcel = () => {
    // Format des données pour Excel
    const exportData = journals.map((journal) => ({
      "Code journal": journal.numjournal,
      Libellé: journal.libellejournal,
    }));

    // Création d'un tableau de travail (workbook)
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "journals");

    // Exportation du fichier Excel
    XLSX.writeFile(wb, "journals.xlsx");
  };

  useEffect(() => {}, [page, rowsPerPage]); // Recharger les journals à chaque changement de page ou d'éléments par page

  return (
    <Container
      sx={{
        backgroundColor: "#f6f2f1",
        padding: 2,
        marginTop: 15,
        maxWidth: "100%",
        overflowX: "auto",
        paddingTop: 2,
      }}
    >
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "#333" }}>
        Liste des journals
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: "#007BFF",
            color: "#fff",
            "&:hover": { backgroundColor: "#0056b3" },
            width: isMobile ? "100%" : "auto",
            mt: isMobile ? 1 : 0,
          }}
          onClick={handleAdd}
        >
          Ajouter un Journal
        </Button>
        {/* Bouton d'impression PDF */}
        <IconButton sx={{ marginLeft: 2 }} color="primary" onClick={handlePrintPDF}>
          <Print />
        </IconButton>

        {/* Bouton d'exportation Excel */}
        <IconButton sx={{ marginLeft: 2 }} color="primary" onClick={handleExportExcel}>
          <FileDownload />
        </IconButton>
      </Box>

      {isMobile ? (
        <Stack spacing={2}>
          {journals.map((journal) => (
            <Card key={journal._id} sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6">{journal.codejournal}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {journal.libjournal}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <IconButton onClick={() => handleEdit(journal)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(journal._id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            marginTop: 2,
          }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: "#f4f6f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "15%" }}>Code Journal</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "65%" }}>Libellé journal</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "20%", textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {journals.map((journal) => (
                <TableRow
                  key={journal._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell sx={{ width: "15%" }}>{journal.codejournal}</TableCell>
                  <TableCell sx={{ width: "65%" }}>{journal.libjournal}</TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    <IconButton onClick={() => handleEdit(journal)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(journal._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[4, 10, 25]} // Modifié à 4 éléments par page
        component="div"
        count={journals.length} // Tu devras obtenir le nombre total d'éléments depuis ton API
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {openDialog && (
        <AddEditJournal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fetchJournals={fetchJournals}
          journal={selectedJournal}
        />
      )}

      <Drawer anchor="right" open={openFilter} onClose={() => setOpenFilter(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6">Filtrer par Champs</Typography>
          <Box sx={{ marginTop: 2 }}>
            {/* Liste des champs disponibles pour le filtrage */}
            {["numJournal", "libelleJournal"].map((field) => (
              <Box key={field} sx={{ marginBottom: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.includes(field)} // Vérifie si le champ est sélectionné
                      onChange={() => handleFieldSelection(field)} // Ajoute ou retire le champ de la liste des champs sélectionnés
                    />
                  }
                  label={field} // Nom du champ pour filtrer
                />
                {/* Affiche le champ de saisie si le champ est sélectionné */}
                {selectedFields.includes(field) && (
                  <TextField
                    label={`Filtrer par ${field}`} // Affiche le nom du champ dans le texte de saisie
                    variant="outlined"
                    fullWidth
                    value={filters[field]} // Valeur du champ de filtre
                    onChange={(e) => handleFilterChange(field, e.target.value)} // Met à jour la valeur du filtre
                    sx={{ marginTop: 1 }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* Boutons Appliquer et Effacer */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleApplyFilter} // Applique le filtre
            >
              Appliquer
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={handleClearFilter} // Efface les filtres
            >
              Effacer
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
}
