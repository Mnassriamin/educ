import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  List,
  ListItem,
} from "@mui/material";

const PlanningInfoModal = ({
  open,
  handleClose,
  onDeleteEvent,
  onModifyEvent,
  currentEvent,
  userType,
  classes,
  matieres,
}) => {
  if (!currentEvent) return null;

  const { name, matiere, description, etudiants = [], class: courseClass, color } = currentEvent;

  const matiereName =
    typeof matiere === "object"
      ? matiere.name
      : matieres
      ? matieres.find((m) => m._id === matiere)?.name || matiere
      : matiere;

  const className =
    typeof courseClass === "object"
      ? courseClass.name
      : classes
      ? classes.find((c) => c._id === courseClass)?.name || courseClass
      : courseClass;

  const handleDeleteConfirmation = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      onDeleteEvent();
    }
  };

  // Custom close handler that blurs any active element before closing the dialog.
  const handleCloseModal = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>Course Information</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle1">Course Name: {name}</Typography>
          {color && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: color,
                  borderRadius: "50%",
                  mr: 1,
                }}
              />
              <Typography variant="body2">Color: {color}</Typography>
            </Box>
          )}
          <Typography variant="body2">Matière: {matiereName}</Typography>
          <Typography variant="body2">Class: {className}</Typography>
          {description && <Typography variant="body2">Description: {description}</Typography>}
          {etudiants && etudiants.length > 0 && (
            <>
              <Typography variant="subtitle1">Enrolled Students ({etudiants.length})</Typography>
              <List>
                {etudiants.map((student) => (
                  <ListItem key={student.enfantId}>• {student.enfantName}</ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="inherit">
          Close
        </Button>
        {userType === "admin" && (
          <>
            <Button onClick={onModifyEvent} color="primary">
              Modify
            </Button>
            <Button onClick={handleDeleteConfirmation} color="error">
              Delete
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PlanningInfoModal;
