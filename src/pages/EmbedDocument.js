import React, { useState, useEffect } from "react";
import { embedDocument, fetchNamespaces } from "../api";

const extensionsAllowed = ["pdf", "docx", "doc", "txt"];

function EmbedDocument() {
  const [fileURL, setFileURL] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [category, setCategory] = useState(""); // New state for category
  const [title, setTitle] = useState(""); // New state for title
  const [loading, setLoading] = useState(false);
  const [res, SetRes] = useState(null);

  useEffect(() => {
    fetchNamespaces()
      .then((response) => {
        const data = response.data.namespaces; // Fetching countries (namespaces)
        setCountries(data);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleEmbed = () => {
    setLoading(true);

    if (!title || !category || !fileURL || !selectedCountry) {
      alert("All fields are required (title, category, file URL, and country)");
      setLoading(false);
      return;
    }

    const metadata = { title, type: "pdf", link: fileURL };
    const extension = fileURL.split(".");
    
    if (extensionsAllowed.includes(extension[extension.length - 1])) {
      embedDocument(fileURL, selectedCountry, category, metadata)
        .then((response) => {
          SetRes(response.data);
          setLoading(false);
          alert("Document embedded successfully");
        })
        .catch((err) => {
          setLoading(false);
          alert("Error embedding document");
        });
    } else {
      alert("Extension not allowed. Only pdf, docx, doc, and txt files are allowed.");
      setLoading(false);
    }
  };

  const fileChange = (e) => {
    setFileURL(e.target.value);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Embed Document</h1>

      {/* File URL input */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="File URL"
        value={fileURL}
        onChange={fileChange}
      />

      {/* Title input */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Category input */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* Country selection */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* Embed button */}
      <button
        className={`bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center ${loading && "cursor-wait opacity-75"}`}
        onClick={handleEmbed}
        disabled={loading}
      >
        Embed{" "}
        {loading && (
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mx-auto"></div>
        )}
      </button>

      {/* Response display */}
      {res ? <div className="mt-8">{JSON.stringify(res)}</div> : null}
    </div>
  );
}

export default EmbedDocument;
