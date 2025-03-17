// src/components/MDBox/index.d.ts
import * as React from "react";
import { BoxProps } from "@mui/material/Box";

// Tell TypeScript that MDBox is a React functional component
// that accepts all props defined in MUI’s Box (including children, mt, mb, etc.)
declare const MDBox: React.FC<BoxProps>;
export default MDBox;
