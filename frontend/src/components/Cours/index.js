// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your course components
import ListCours from "./ListCours";
import CreateCours from "./CreateCours";
import UpdateCours from "./UpdateCours";
import DeleteCours from "./DeleteCours";

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cours/*" element={<ListCours />} />
        <Route path="/cours/create" element={<CreateCours />} />
        <Route path="/cours/update/:id" element={<UpdateCours />} />
        <Route path="/cours/delete/:id" element={<DeleteCours />} />
        {/* Fallback route */}
        <Route path="*" element={<ListCours />} />
      </Routes>
    </BrowserRouter>
  );
}

// Create the root and render the App component
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
