import { useEffect, useRef, useState } from "react";
import { getSystemMessage, updateSystemMessage } from "../api";

function SystemMessage() {
  const [systemMessage, setSystemMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const originalMessage = useRef();

  useEffect(() => {
    fetchSystemMessage();
  }, []);

  const fetchSystemMessage = () => {
    getSystemMessage()
      .then((response) => {
        originalMessage.current = response.data.system_message;
        setSystemMessage(response.data.system_message);
      })
      .catch((err) => {
        alert("Error fetching system message!");
      });
  };

  const handleUpdate = () => {
    setLoading(true);
    updateSystemMessage(systemMessage)
      .then((response) => {
        setLoading(false);
        alert("System message updated!");
      })
      .catch((err) => {
        setLoading(false);
        setSystemMessage(originalMessage.current);
        alert("Error updating system message!");
      });
  };
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">System Message</h1>
      <textarea
        className="border py-3 px-4 rounded w-full mb-4 outline-none"
        placeholder="System Message"
        value={systemMessage}
        onChange={(e) => setSystemMessage(e.target.value)}
        rows={5}
        columns={10}
      ></textarea>
      <button
        className={`bg-green-500 text-white px-4 py-2 rounded flex gap-2 items-center ${
          loading && "cursor-wait opacity-75"
        }`}
        onClick={handleUpdate}
        disabled={loading}
      >
        Update{" "}
        {loading && (
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mx-auto"></div>
        )}
      </button>
    </div>
  );
}

export default SystemMessage;
