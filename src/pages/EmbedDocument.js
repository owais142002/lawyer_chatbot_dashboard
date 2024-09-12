import React, { useState, useEffect } from 'react';
import { embedDocument, fetchNamespaces } from '../api';

function EmbedDocument() {
  const [fileURL, setFileURL] = useState('');
  const [countries, setCountries] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('');  

  useEffect(() => {
    fetchNamespaces()
      .then(response => {
        const data = response.data.data;
        setCountries(Object.keys(data));
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  const handleEmbed = () => {
    const metadata = { type: 'pdf', link: fileURL };
    embedDocument(fileURL, selectedCountry, selectedNamespace, metadata)
      .then(response => {
        alert('Document embedded successfully');
      })
      .catch(err => {
        alert('Error embedding document');
      });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedNamespace('');
    if (country) {
      fetchNamespaces()
        .then(response => {
          setNamespaces(response.data.data[country] || []);
        })
        .catch(err => console.error('Error fetching namespaces:', err));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Embed Document</h1>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="File URL"
        value={fileURL}
        onChange={e => setFileURL(e.target.value)}
      />
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>
          {countries.map(country => (
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
          {namespaces.map(namespace => (
            <option key={namespace} value={namespace}>
              {namespace}
            </option>
          ))}
        </select>
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleEmbed}>
        Embed
      </button>
    </div>
  );
}

export default EmbedDocument;
