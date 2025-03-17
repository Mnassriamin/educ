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

const EventInfoModal = ({
  open,
  handleClose,
  onDeleteEvent,
  currentEvent,
  userType,
  classes,
  matieres,
}) => {
  if (!currentEvent) return null;

  const {
    _id,
    name,
    matiere,
    description,
    etudiants = [],
    class: courseClass,
    color,
  } = currentEvent;

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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
                {etudiants.map((student, index) => (
                  <ListItem key={student.enfantId || index}>• {student.enfantName}</ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
        {userType === "prof" && (
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

EventInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
  currentEvent: PropTypes.shape({
    _id: PropTypes.any,
    name: PropTypes.string,
    matiere: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ name: PropTypes.string })]),
    description: PropTypes.string,
    etudiants: PropTypes.array,
    class: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ name: PropTypes.string })]),
    color: PropTypes.string,
  }),
  userType: PropTypes.oneOf(["prof", "parent", "admin"]),
  classes: PropTypes.array,
  matieres: PropTypes.array,
};

export default EventInfoModal;
