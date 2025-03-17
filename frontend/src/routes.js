import React from "react";
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Calendar from "layouts/calendar";
import Planing from "layouts/planing"; // use the correct path and case
import Cours from "layouts/Cours"; // Cours layout
import Eleve from "layouts/Eleve"; // Eleve layout
import Groupe from "layouts/Groupe"; // Groupe layout

import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Matiere from "layouts/Matiere";
import Users from "layouts/User";
import SignOut from "./layouts/authentication/sign-out/SignOut"; // A component that clears token and redirects

// @mui icons
import Icon from "@mui/material/Icon";

// Import route guard components
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const routes = [
  // Protected routes
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    allowedRoles: ["admin", "prof", "parent"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof", "parent"]}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Profs",
    key: "Profs",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    allowedRoles: ["admin"],
    component: (
      <PrivateRoute allowedRoles={["admin"]}>
        <Tables />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    allowedRoles: ["admin"],
    component: (
      <PrivateRoute allowedRoles={["admin"]}>
        <Billing />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Planning",
    key: "Planing",
    icon: <Icon fontSize="small">calendar_today</Icon>,
    route: "/Planing",
    allowedRoles: ["admin", "prof"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof"]}>
        <Planing />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Cours",
    key: "calendar",
    icon: <Icon fontSize="small">calendar_today</Icon>,
    route: "/Calendar",
    allowedRoles: ["admin", "prof", "parent"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof", "parent"]}>
        <Calendar />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Matière",
    key: "matiere",
    icon: <Icon fontSize="small">book</Icon>,
    route: "/matiere",
    allowedRoles: ["admin"],
    component: (
      <PrivateRoute allowedRoles={["admin"]}>
        <Matiere />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    allowedRoles: ["admin"],
    component: (
      <PrivateRoute allowedRoles={["admin"]}>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Eleves",
    key: "eleve",
    icon: <Icon fontSize="small">school</Icon>,
    route: "/eleve",
    allowedRoles: ["admin", "prof", "parent"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof", "parent"]}>
        <Eleve />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    allowedRoles: ["admin", "prof", "parent"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof", "parent"]}>
        <Notifications />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    allowedRoles: ["admin", "prof", "parent"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof", "parent"]}>
        <Profile />
      </PrivateRoute>
    ),
  },
  // Public routes: only shown when no user is logged in.
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    allowedRoles: [],
    component: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    allowedRoles: [],
    component: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  // Sign Out route: visible only when logged in.
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/sign-out",
    allowedRoles: ["admin", "prof", "parent"],
    component: (
      <PrivateRoute allowedRoles={["admin", "prof", "parent"]}>
        <SignOut />
      </PrivateRoute>
    ),
  },
];

export default routes;
