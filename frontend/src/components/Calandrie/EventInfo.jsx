import React from "react";
import { Typography, Box, List, ListItem } from "@mui/material";

const EventInfo = ({ event }) => {
  const { name, matiere, datedebut, datefin, etudiants = [] } = event;

  // If matiere is an object, use its "name" property; otherwise, treat it as a string.
  const matiereString = typeof matiere === "object" ? matiere.name : matiere || "N/A";

  // Convert dates to locale strings
  const startDate = datedebut ? new Date(datedebut).toLocaleString() : "N/A";
  const endDate = datefin ? new Date(datefin).toLocaleString() : "N/A";

  return (
    <Box sx={{ p: 1 }}>
      {/* Course name */}
      <Typography variant="h6" gutterBottom>
        {name || "Untitled Course"}
      </Typography>

      {/* Matière & Dates */}
      <Typography variant="body1">
        <strong>Matière:</strong> {matiereString}
      </Typography>
      <Typography variant="body2">
        <strong>Start:</strong> {startDate}
      </Typography>
      <Typography variant="body2">
        <strong>End:</strong> {endDate}
      </Typography>

      {/* Enrolled students */}
      <Box mt={2}>
        <Typography variant="subtitle1">Enrolled Students ({etudiants.length})</Typography>
        {etudiants.length === 0 ? (
          <Typography variant="body2">None enrolled.</Typography>
        ) : (
          <List disablePadding sx={{ ml: 2 }}>
            {etudiants.map((student, index) => (
              <ListItem key={student.enfantId || index}>• {student.enfantName}</ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default EventInfo;
