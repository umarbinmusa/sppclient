import React from "react";
import ApiModal from "./ApiModal";
import CopyableField from "./CopyableField";
import { useApiManagement } from "../../context/ApiManagementContext";

// Shown immediately after Make API User / regenerate-key / regenerate-secret.
// These values are never retrievable again after this modal closes, so the
// warning here matters more than most.
const CredentialsRevealModal = () => {
  const { issuedCredential, clearIssuedCredential } = useApiManagement();
  if (!issuedCredential) return null;

  const { apiUserId, apiKey, apiSecret } = issuedCredential;

  return (
    <ApiModal title="API credentials issued">
      <p className="text-red-600 font-bold text-center mb-3">
        Save these now — they will not be shown again.
      </p>
      {apiUserId && <CopyableField label="API User ID" value={apiUserId} />}
      {apiKey && <CopyableField label="API Key" value={apiKey} />}
      {apiSecret && <CopyableField label="API Secret" value={apiSecret} />}
      <p className="text-xs text-gray-500 mt-2">
        Keep these credentials private. Anyone with them can use this API user's wallet.
      </p>
      <button className="btn btn-block mt-3" onClick={clearIssuedCredential}>
        I have saved these — close
      </button>
    </ApiModal>
  );
};

export default CredentialsRevealModal;
