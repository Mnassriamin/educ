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
  Drawer,
  Checkbox,
  FormControlLabel,
  TextField,
  TablePagination,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  FilterList,
  ArrowDownward,
  ArrowUpward,
  Print,
  FileDownload,
} from "@mui/icons-material";
import axios from "axios";
import AddMatiere from "./AddMatiere";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function MatiereList() {
  const [matieres, setMatieres] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({ name: "" });
  const [selectedFields, setSelectedFields] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  // Selection
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch matières from the backend
  const fetchMatieres = async () => {
    try {
      const response = await axios.get("http://localhost:5000/matiere/get");
      setMatieres(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des matières :", error);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  // Delete a matière
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/matiere/${id}`);
      fetchMatieres();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Open edit dialog for a matière
  const handleEdit = (matiere) => {
    setSelectedMatiere(matiere);
    setOpenDialog(true);
  };

  // Open add dialog
  const handleAdd = () => {
    setSelectedMatiere(null);
    setOpenDialog(true);
  };

  // Filter change handlers
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
    setOpenFilter(false);
  };

  const handleClearFilter = () => {
    setFilters({ name: "" });
    setSelectedFields([]);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sorting handler for "name"
  const handleSortLibelle = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedMatieres = [...matieres].sort((a, b) =>
      newSortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setMatieres(sortedMatieres);
  };

  // Row selection handlers
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((row) => row !== id) : [...prevSelected, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(matieres.map((matiere) => matiere._id));
    } else {
      setSelectedRows([]);
    }
  };

  // Print PDF of the matières list
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des Matières", 14, 20);
    const headers = ["Nom"];
    const rows = matieres.map((matiere) => [matiere.name]);
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
    });
    doc.save("matieres.pdf");
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = matieres.map((matiere) => ({
      Nom: matiere.name,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matières");
    XLSX.writeFile(wb, "matieres.xlsx");
  };

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
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#333",
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        Liste des Matières
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            backgroundColor: "#007BFF",
            color: "#fff",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Ajouter une Matière
        </Button>
        <Box>
          <IconButton color="primary" onClick={handlePrintPDF}>
            <Print />
          </IconButton>
          <IconButton color="primary" onClick={handleExportExcel}>
            <FileDownload />
          </IconButton>
          <IconButton color="primary" onClick={() => setOpenFilter(true)}>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

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
              <TableCell>
                <Checkbox
                  checked={selectedRows.length === matieres.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: { xs: "40%", sm: "40%" },
                  cursor: "pointer",
                }}
                onClick={handleSortLibelle}
              >
                Nom{" "}
                {sortOrder === "asc" ? (
                  <ArrowDownward sx={{ fontSize: 14, marginLeft: 1 }} />
                ) : (
                  <ArrowUpward sx={{ fontSize: 14, marginLeft: 1 }} />
                )}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: { xs: "25%", sm: "20%" },
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matieres
              .filter((matiere) =>
                Object.keys(filters).every(
                  (key) =>
                    !filters[key] ||
                    matiere[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
                )
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((matiere) => (
                <TableRow
                  key={matiere._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f1f1f1" },
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(matiere._id)}
                      onChange={() => handleRowSelect(matiere._id)}
                    />
                  </TableCell>
                  <TableCell sx={{ width: { xs: "25%", sm: "20%" } }}>{matiere.name}</TableCell>
                  <TableCell
                    sx={{
                      width: { xs: "25%", sm: "20%" },
                      textAlign: "center",
                    }}
                  >
                    <IconButton onClick={() => handleEdit(matiere)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(matiere._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[4]}
        component="div"
        count={matieres.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page"
      />

      <Drawer anchor="right" open={openFilter} onClose={() => setOpenFilter(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6">Filtre par Champs</Typography>
          <Box sx={{ marginTop: 2 }}>
            {["name"].map((field) => (
              <Box key={field} sx={{ marginBottom: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldSelection(field)}
                    />
                  }
                  label={field}
                />
                {selectedFields.includes(field) && (
                  <TextField
                    label={`Filtrer par ${field}`}
                    variant="outlined"
                    fullWidth
                    value={filters[field]}
                    onChange={(e) => handleFilterChange(field, e.target.value)}
                    sx={{ marginTop: 1 }}
                  />
                )}
              </Box>
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleApplyFilter}
          >
            Appliquer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginTop: 2, marginLeft: 1 }}
            onClick={handleClearFilter}
          >
            Effacer
          </Button>
        </Box>
      </Drawer>

      {openDialog && (
        <AddMatiere
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fetchComptes={fetchMatieres}
          compte={selectedMatiere}
        />
      )}
    </Container>
  );
}
