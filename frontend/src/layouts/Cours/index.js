import React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
// Ensure the correct import path for your ListCours component:
import ListCours from "../../components/Cours/CoursItems/ListCours";

const Cours = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ListCours />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Cours;
