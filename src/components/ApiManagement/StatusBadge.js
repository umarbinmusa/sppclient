import React from "react";

const COLORS = {
  ACTIVE: "bg-green-100 text-green-700",
  SUCCESS: "bg-green-100 text-green-700",
  SUSPENDED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REVOKED: "bg-red-100 text-red-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-blue-100 text-blue-700",
};

const StatusBadge = ({ status }) => {
  const classes = COLORS[String(status).toUpperCase()] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${classes}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
