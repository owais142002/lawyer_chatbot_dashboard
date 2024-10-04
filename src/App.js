import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FetchNamespaces from "./pages/FetchNamespaces";
import Settings from "./pages/Settings";
import ManageDocuments from "./pages/ManageDocuments";
import EmbedDocument from "./pages/EmbedDocument";
import Navbar from "./components/Navbar";
import SystemMessage from "./pages/SystemMessage";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute component

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mx-auto mt-8">
          <Routes>
            <Route path="/settings" element={<Settings />} />
            
            {/* Wrap all routes that require authentication in PrivateRoute */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/fetch-namespaces"
              element={
                <PrivateRoute>
                  <FetchNamespaces />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-documents"
              element={
                <PrivateRoute>
                  <ManageDocuments />
                </PrivateRoute>
              }
            />
            <Route
              path="/embed-document"
              element={
                <PrivateRoute>
                  <EmbedDocument />
                </PrivateRoute>
              }
            />
            <Route
              path="/system-message"
              element={
                <PrivateRoute>
                  <SystemMessage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
