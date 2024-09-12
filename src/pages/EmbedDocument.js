import React, { useState, useEffect } from "react";
import { embedDocument, fetchNamespaces } from "../api";

const extensionsAllowed = ["pdf", "docx", "doc", "txt"];

function EmbedDocument() {
  const [fileURL, setFileURL] = useState("");
  const [countries, setCountries] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, SetRes] = useState(null);

  useEffect(() => {
    fetchNamespaces()
      .then((response) => {
        const data = response.data.data;
        setCountries(Object.keys(data));
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleEmbed = () => {
    setLoading(true);
    const metadata = { type: "pdf", link: fileURL };
    const extension = fileURL.split(".");
    if (extensionsAllowed.includes(extension[extension.length - 1])) {
      embedDocument(fileURL, selectedCountry, selectedNamespace, metadata)
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
      alert(
        "Extension not allowed. Only pdf, docx, doc and txt files are allowed."
      );
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedNamespace("");
    if (country) {
      fetchNamespaces()
        .then((response) => {
          setNamespaces(response.data.data[country] || []);
        })
        .catch((err) => console.error("Error fetching namespaces:", err));
    }
  };

  const fileChange = (e) => {
    setFileURL(e.target.value);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Embed Document</h1>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="File URL"
        value={fileURL}
        onChange={(e) => fileChange(e)}
      />
      <select
        className="border p-2 rounded w-full mb-4"
        value={selectedCountry}
        onChange={handleCountryChange}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <select
        className="border p-2 rounded w-full mb-4"
        value={selectedNamespace}
        onChange={(e) => setSelectedNamespace(e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">Select Namespace</option>
        {namespaces.map((namespace) => (
          <option key={namespace} value={namespace}>
            {namespace}
          </option>
        ))}
      </select>
      <button
        className={`bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center ${
          loading && "cursor-wait opacity-75"
        }`}
        onClick={handleEmbed}
        disabled={loading}
      >
        Embed{" "}
        {loading && (
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mx-auto"></div>
        )}
      </button>
      {res ? <div className="mt-8">{JSON.stringify(res)}</div> : null}
    </div>
  );
}

export default EmbedDocument;

// {loading && (
//   <div className="text-center">
//     <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto"></div>
//     <p className="mt-2">Fetching documents...</p>
//   </div>
// )}
