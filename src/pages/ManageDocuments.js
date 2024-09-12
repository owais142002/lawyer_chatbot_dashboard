import React, { useEffect, useState } from 'react';
import { fetchNamespaces, fetchNamespacesData, deleteEmbedding } from '../api';

function ManageDocuments() {
  const [countries, setCountries] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [page, setPage] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupLink, setPopupLink] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const [totalPages, setTotalPages] = useState(10); // Set as an example, can be dynamic
  const [noRecords, setNoRecords] = useState(false); // New state for no records message

  useEffect(() => {
    fetchNamespaces()
      .then(response => {
        const data = response.data.data;
        setCountries(Object.keys(data));
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

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

  const handleFetchDocuments = (pageNumber) => {
    if (selectedCountry && selectedNamespace) {
      setLoading(true); // Set loading state to true
      setNoRecords(false); // Reset no records message
      fetchNamespacesData(selectedCountry, selectedNamespace, pageNumber)
        .then(response => {
          const fetchedDocuments = response.data.data;
          setDocuments(fetchedDocuments);
          setPage(pageNumber);
          setLoading(false); // Set loading state to false
          if (fetchedDocuments.length === 0) {
            setNoRecords(true); // Show no records message if empty
          }
        })
        .catch(err => {
          console.error('Error fetching documents:', err);
          setLoading(false); // Set loading state to false
        });
    }
  };

  const handleDeleteDocument = (link) => {
    deleteEmbedding(selectedCountry, selectedNamespace, link)
      .then(() => {
        alert('Document deleted successfully');
        handleFetchDocuments(page);
      })
      .catch(err => alert('Failed to delete document'));
  };

  const handleShowPopup = (content, link) => {
    setPopupContent(content);
    setPopupLink(link);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  const handleNextPageSet = () => {
    if (page < totalPages) {
      setPage(page + 1);
      handleFetchDocuments(page + 1);
    }
  };

  const handlePreviousPageSet = () => {
    if (page > 1) {
      setPage(page - 1);
      handleFetchDocuments(page - 1);
    }
  };

  const renderPagination = () => {
    const paginationRange = 5; // Show 5 pages at a time
    let startPage = Math.max(1, page - Math.floor(paginationRange / 2));
    let endPage = Math.min(totalPages, startPage + paginationRange - 1);

    if (endPage - startPage < paginationRange - 1) {
      startPage = Math.max(1, endPage - paginationRange + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleFetchDocuments(i)}
          className={`px-4 py-2 rounded border ${
            page === i ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handlePreviousPageSet}
          disabled={page === 1}
          className="px-4 py-2 rounded border bg-gray-100 text-black"
        >
          &lt;
        </button>
        {pages}
        <button
          onClick={handleNextPageSet}
          disabled={page === totalPages}
          className="px-4 py-2 rounded border bg-gray-100 text-black"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Documents</h1>

      <div className="mb-6">
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

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleFetchDocuments(1)}
          disabled={!selectedCountry || !selectedNamespace}
        >
          Fetch Documents
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto"></div>
          <p className="mt-2">Fetching documents...</p>
        </div>
      )}

      {/* No records available */}
      {noRecords && !loading && (
        <div className="text-center text-gray-500">
          <p>No records available.</p>
        </div>
      )}

      {/* Display documents */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!loading && documents.length > 0 && documents.map((doc, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-md">
            <p className="text-sm mb-2">Content: {doc.content.slice(0, 100)}...</p>
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Open URL
            </a>
            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleShowPopup(doc.content, doc.link)}
              >
                View Content
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteDocument(doc.link)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {documents.length > 0 && renderPagination()}

      {/* Popup for viewing content */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg overflow-y-auto max-h-screen relative">
            <button
              className="absolute top-2 right-2 text-gray-600 font-bold text-xl"
              onClick={handleClosePopup}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Document Content</h2>
            <p className="mb-6 overflow-y-auto max-h-96">{popupContent}</p>
            <div className="flex justify-between items-center">
              <a
                href={popupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Open URL
              </a>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDocuments;
