
import { useEffect, useState } from "react";
import { getSupportMessages } from "../api/supportmessage"; 

export const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await getSupportMessages();

      // ✅ IMPORTANT: take .data.data
      setMessages(res.data.data);

    } catch (err) {
      console.error(err);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-orange-100">
            <tr>
            <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((item, index) => (
              <tr key={item._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.email}</td>
                <td className="border p-2">{item.phone}</td>
                <td className="border p-2">{item.message}</td>
                <td className="border p-2">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <p className="text-center mt-4 text-gray-500">
            No messages found
          </p>
        )}
      </div>
    </div>
  );
};


