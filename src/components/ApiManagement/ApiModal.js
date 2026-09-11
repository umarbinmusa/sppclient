import React from "react";

const ApiModal = ({ title, onClose, children, wide = false }) => {
  return (
    <div className="bg-black/50 fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center z-50 p-4">
      <div
        className={`bg-white p-4 rounded-lg w-full ${
          wide ? "max-w-[700px]" : "max-w-[420px]"
        } max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-2">
          {title && <p className="uppercase font-bold text-lg">{title}</p>}
          {onClose && (
            <button type="button" className="btn btn-danger m-0 px-2 py-1" onClick={onClose}>
              close
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default ApiModal;
