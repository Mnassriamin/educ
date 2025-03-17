/**
 =========================================================
 * Material Dashboard 2 React - v2.2.0
 =========================================================
 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)
 *
 * Coded by www.creative-tim.com
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
// Ensure the correct import path for your calendar component:
import EventCalendar from "../../components/Calandrie";

const Calendar = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EventCalendar />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Calendar;
