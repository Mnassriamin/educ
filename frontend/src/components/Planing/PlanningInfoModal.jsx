import React from "react";
import PropTypes from "prop-types";
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
  onAddToTimetable,
  currentEvent,
  userType,
  classes,
  matieres,
}) => {
  if (!currentEvent) return null;

  const { name, matiere, description, etudiants = [], class: courseClass, color } = currentEvent;

  // Determine the matière name.
  const matiereName =
    typeof matiere === "object"
      ? matiere.name
      : matieres
      ? matieres.find((m) => m._id === matiere)?.name || matiere
      : matiere;

  // Determine the class name.
  const className =
    typeof courseClass === "object"
      ? courseClass.name
      : classes
      ? classes.find((c) => c._id === courseClass)?.name || courseClass
      : courseClass;

  // Confirm deletion before calling onDeleteEvent.
  const handleDeleteConfirmation = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      onDeleteEvent();
    }
  };

  // Blur the active element before closing to avoid ARIA warnings.
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
        {userType === "prof" && onAddToTimetable && (
          <Button onClick={onAddToTimetable} color="success">
            Add to My Time Table
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

PlanningInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
  onModifyEvent: PropTypes.func.isRequired,
  onAddToTimetable: PropTypes.func,
  currentEvent: PropTypes.shape({
    name: PropTypes.string,
    matiere: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ name: PropTypes.string })]),
    description: PropTypes.string,
    etudiants: PropTypes.array,
    class: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ name: PropTypes.string })]),
    color: PropTypes.string,
  }),
  userType: PropTypes.oneOf(["admin", "prof", "parent"]).isRequired,
  classes: PropTypes.array,
  matieres: PropTypes.array,
};

export default PlanningInfoModal;
