import React from "react";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";

const CopyableField = ({ label, value, mono = true }) => {
  const copy = async () => {
    if (!value) return;
    await window.navigator.clipboard.writeText(value);
    toast.success("Copied");
  };
  return (
    <div className="mb-3">
      {label && <p className="text-xs uppercase font-bold text-gray-500 mb-1">{label}</p>}
      <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
        <span className={`flex-1 break-all text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
        <button type="button" className="btn m-0 px-2 py-1" onClick={copy}>
          <FaCopy />
        </button>
      </div>
    </div>
  );
};

export default CopyableField;
