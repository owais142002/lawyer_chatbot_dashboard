import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FetchNamespaces from "./pages/FetchNamespaces";
import ManageDocuments from "./pages/ManageDocuments";
import EmbedDocument from "./pages/EmbedDocument";
import Navbar from "./components/Navbar";
import SystemMessage from "./pages/SystemMessage";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mx-auto mt-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fetch-namespaces" element={<FetchNamespaces />} />
            <Route path="/manage-documents" element={<ManageDocuments />} />
            <Route path="/embed-document" element={<EmbedDocument />} />
            <Route path="/system-message" element={<SystemMessage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
