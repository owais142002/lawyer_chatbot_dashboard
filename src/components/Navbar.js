import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/fetch-namespaces"
            className="text-white hover:text-gray-400"
          >
            Namespaces Management
          </Link>
        </li>
        <li>
          <Link
            to="/manage-documents"
            className="text-white hover:text-gray-400"
          >
            Manage Documents
          </Link>
        </li>
        <li>
          <Link to="/embed-document" className="text-white hover:text-gray-400">
            Embed Document
          </Link>
        </li>
        <li>
          <Link to="/system-message" className="text-white hover:text-gray-400">
            System Message
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
