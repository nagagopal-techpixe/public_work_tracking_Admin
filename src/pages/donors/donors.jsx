import React, { useEffect, useState } from "react";
import { getAllDonors } from "../../api/donor";

const Donors = () => {

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await getAllDonors();
      setDonors(res.data.data);
    } catch (err) {
      setError("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="p-6">

    <h2 className="text-2xl font-bold mb-4">Donors List</h2>

    {/* Loading */}
    {loading && <p>Loading...</p>}

    {/* Error */}
    {error && <p className="text-red-500">{error}</p>}

    {/* Table */}
    {!loading && !error && (
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Amount (₹)</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>

          <tbody>
            {donors.map((donor) => (
              <tr key={donor._id} className="text-center">
                <td className="p-2 border">{donor.fullname}</td>
                <td className="p-2 border">{donor.mobilenumber}</td>
                <td className="p-2 border">{donor.email}</td>
                <td className="p-2 border font-semibold">
                  ₹{donor.donationamount}
                </td>
                <td className="p-2 border">
                  {new Date(donor.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>
);

};

export default Donors;
