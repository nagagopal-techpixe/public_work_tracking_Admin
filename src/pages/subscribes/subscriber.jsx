import React, { useEffect, useState } from "react";
import { getsubcribers } from "../../api/subscriber"

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);

      const res = await getsubcribers();

      // API returns data inside res.data.data
      setSubscribers(res.data.data || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-slate-100 py-10 px-4">

    {/* Main Card */}
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200">

      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          📩 Newsletter Subscribers
        </h2>

        <span className="text-sm text-slate-500">
          Total: {subscribers.length}
        </span>
      </div>

      {/* Body */}
      <div className="p-6">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-slate-500 text-lg">
              Loading subscribers...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {subscribers.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-lg font-medium">
                  No subscribers yet
                </p>
                <p className="text-sm mt-1">
                  Newsletter list is empty
                </p>
              </div>
            ) : (

              <div className="overflow-x-auto rounded-lg border border-slate-200">

                <table className="w-full text-sm text-left">

                  {/* Head */}
                  <thead className="bg-slate-50 text-slate-700 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-5 py-4 border-b">
                        S.No
                      </th>
                      <th className="px-5 py-4 border-b">
                        Email Address
                      </th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody className="divide-y divide-slate-100">

                    {subscribers.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-orange-50 transition-colors"
                      >
                        <td className="px-5 py-4 font-medium text-slate-700">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {item.email}
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}
          </>
        )}

      </div>

    </div>

  </div>
);

};

export default Subscribers;
