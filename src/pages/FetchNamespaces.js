import React, { useEffect, useState } from 'react';
import { fetchNamespaces, createNewCountry, addNamespace, deleteNamespace, deleteCountry } from '../api';

function FetchNamespaces() {
  const [namespaces, setNamespaces] = useState({});
  const [newCountry, setNewCountry] = useState(''); // State for new country
  const [newNamespace, setNewNamespace] = useState(''); // State for new namespace in new country form
  const [countryNamespaceInput, setCountryNamespaceInput] = useState({}); // State for each country input field
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch namespaces on page load
  useEffect(() => {
    fetchNamespaces().then(response => {
      setNamespaces(response.data.data);
    }).catch(err => {
      console.error('Error fetching namespaces:', err);
    });
  }, []);

  // Add new country and namespace
  const handleCreateCountry = () => {
    if (!newCountry || !newNamespace) {
      setError('Country and namespace are required');
      return;
    }
    setError('');
    createNewCountry(newCountry, newNamespace)
      .then(response => {
        setSuccessMessage('Country and namespace created successfully');
        refreshNamespaces();  // Refresh after creating
      })
      .catch(err => {
        setError('Failed to create country and namespace');
      });
  };

  // Add a new namespace to an existing country
  const handleAddNamespace = (country) => {
    if (!countryNamespaceInput[country]) {
      setError('Namespace is required');
      return;
    }
    setError('');
    addNamespace(country, countryNamespaceInput[country])
      .then(response => {
        setSuccessMessage('Namespace added successfully');
        refreshNamespaces();  // Refresh after adding
      })
      .catch(err => {
        setError('Failed to add namespace');
      });
  };

  // Delete a specific namespace from a country
  const handleDeleteNamespace = (country, namespace) => {
    deleteNamespace(country, namespace)
      .then(response => {
        setSuccessMessage('Namespace deleted successfully');
        refreshNamespaces();  // Refresh after deleting
      })
      .catch(err => {
        setError('Failed to delete namespace');
      });
  };

  // Delete a country
  const handleDeleteCountry = (country) => {
    deleteCountry(country)
      .then(response => {
        setSuccessMessage('Country deleted successfully');
        refreshNamespaces();  // Refresh after deleting
      })
      .catch(err => {
        setError('Failed to delete country');
      });
  };

  // Refresh the namespaces after any update
  const refreshNamespaces = () => {
    fetchNamespaces().then(response => {
      setNamespaces(response.data.data);
      setNewCountry('');
      setNewNamespace('');
      setCountryNamespaceInput({});
    }).catch(err => {
      console.error('Error fetching namespaces:', err);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Namespaces and Countries</h1>

      {/* Error and success messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Form to add new country/namespace */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Country and Namespace</h2>
        <div className="space-y-4 mb-6">
          <input
            className="border p-2 rounded w-full"
            placeholder="New Country"
            value={newCountry}
            onChange={e => setNewCountry(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="New Namespace"
            value={newNamespace}
            onChange={e => setNewNamespace(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateCountry}>
            Create Country and Namespace
          </button>
        </div>
      </div>

      {/* List of countries and namespaces */}
      <h2 className="text-xl font-semibold mb-4">Namespaces by Country</h2>
      <ul className="space-y-6">
        {Object.keys(namespaces).map(country => (
          <li key={country} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{country}</h3>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteCountry(country)}>
                Delete Country
              </button>
            </div>

            <ul className="list-disc pl-5 space-y-2">
              {namespaces[country].map(namespace => (
                <li key={namespace} className="flex justify-between items-center">
                  <span>{namespace}</span>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteNamespace(country, namespace)}>
                    Delete Namespace
                  </button>
                </li>
              ))}
            </ul>

            {/* Add namespace to existing country */}
            <div className="mt-6">
              <input
                className="border p-2 rounded w-full"
                placeholder={`Add new namespace to ${country}`}
                value={countryNamespaceInput[country] || ''}
                onChange={e => setCountryNamespaceInput({
                  ...countryNamespaceInput,
                  [country]: e.target.value
                })}
              />
              <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded" onClick={() => handleAddNamespace(country)}>
                Add Namespace
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FetchNamespaces;
