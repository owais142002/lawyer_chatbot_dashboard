import React, { useEffect, useState } from 'react';
import { fetchNamespaces, createNewCountry, deleteCountry } from '../api';

function FetchNamespaces() {
  const [countries, setCountries] = useState([]); // State for countries (formerly namespaces)
  const [newCountry, setNewCountry] = useState(''); // State for new country input
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch countries (namespaces) on page load
  useEffect(() => {
    fetchNamespaces()
      .then(response => {
        setCountries(response.data.namespaces); // Use the namespaces array directly as countries
      })
      .catch(err => {
        console.error('Error fetching countries:', err);
      });
  }, []);

  // Add new country
  const handleCreateCountry = () => {
    if (!newCountry) {
      setError('Country name is required');
      return;
    }
    setError('');
    createNewCountry(newCountry)
      .then(response => {
        setSuccessMessage('Country created successfully');
        refreshCountries();  // Refresh countries list
      })
      .catch(err => {
        setError('Failed to create country');
      });
  };

  // Delete a country
  const handleDeleteCountry = (country) => {
    deleteCountry(country)
      .then(response => {
        setSuccessMessage('Country deleted successfully');
        refreshCountries();  // Refresh countries list
      })
      .catch(err => {
        setError('Failed to delete country');
      });
  };

  // Refresh the list of countries after any update
  const refreshCountries = () => {
    fetchNamespaces()
      .then(response => {
        setCountries(response.data.namespaces);
        setNewCountry('');
      })
      .catch(err => {
        console.error('Error fetching countries:', err);
      });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Countries</h1>

      {/* Error and success messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Form to add new country */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Country</h2>
        <div className="space-y-4 mb-6">
          <input
            className="border p-2 rounded w-full"
            placeholder="New Country"
            value={newCountry}
            onChange={e => setNewCountry(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateCountry}>
            Add Country
          </button>
        </div>
      </div>

      {/* List of countries */}
      <h2 className="text-xl font-semibold mb-4">Countries</h2>
      <ul className="space-y-6">
        {countries.map(country => (
          <li key={country} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{country}</h3>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteCountry(country)}>
                Delete Country
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FetchNamespaces;
