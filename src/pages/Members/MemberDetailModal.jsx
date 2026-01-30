import React from "react";

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium break-all">{value ?? "-"}</p>
  </div>
);

const MemberDetailModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-1">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-3xl mt-20 rounded-xl shadow-xl z-20">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Member Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Profile */}
            <div className="col-span-2 flex items-center gap-3">
              <img
                src={
                  member.profile_image?.trim()
                    ? member.profile_image
                    : member.full_name
                    ? `https://avatar.iran.liara.run/public?username=${encodeURIComponent(
                        member.full_name
                      )}`
                    : "https://www.loremflickr.com/150/150/robot"
                }
                alt={member.full_name || "Member"}
                className="h-24 w-24 rounded-full border object-cover"
              />
              <div>
                <p className="text-lg font-semibold">
                  {member.full_name || "Unknown Member"}
                </p>
                <p className="text-gray-500">{member.role || "Member"}</p>
              </div>
            </div>

            <Detail label="Name" value={member.full_name} />
            <Detail label="Email" value={member.email} />
            <Detail label="Phone" value={member.phone} />
            <Detail label="Status" value={member.status} />
            <Detail
              label="Approved"
              value={member.approved ? "Approved" : "Not Approved"}
            />
            <Detail
              label="Aadhar Number"
              value={member.aadhar_card_number}
            />

            {/* Aadhar Image */}
            {member.aadhar_card_pic && (
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Aadhar Card</p>
                <img
                  src={member.aadhar_card_pic}
                  alt="Aadhar"
                  className="h-40 w-full rounded border object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
