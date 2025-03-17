// layouts/calendar/index.jsx

import React from "react";
import { Box } from "@mui/material";
import EventCalendar from "./EventPlaning"; // Adjust the import path if needed

const CalendarLayout = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* You can add header, breadcrumbs, or any other layout elements here */}
      <EventCalendar />
    </Box>
  );
};

export default CalendarLayout;
