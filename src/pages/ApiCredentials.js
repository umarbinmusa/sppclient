import React, { useEffect, useState } from "react";
import CopyableField from "../components/ApiManagement/CopyableField";
import StatusBadge from "../components/ApiManagement/StatusBadge";
import FormInput from "../components/FormInput";
import { useApiManagement } from "../context/ApiManagementContext";

const ApiCredentials = () => {
  const {
    myApiCredentials,
    fetchMyApiCredentials,
    regenerateMyApiKey,
    regenerateMyApiSecret,
    updateMyWebhook,
    testMyWebhook,
  } = useApiManagement();

  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    fetchMyApiCredentials();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (myApiCredentials) setWebhookUrl(myApiCredentials.webhookUrl || "");
  }, [myApiCredentials]);

  if (!myApiCredentials) {
    return <p className="text-center md:ml-[6rem]">Loading your credentials...</p>;
  }

  const confirmAndRegenerate = (label, action) => {
    if (
      window.confirm(
        `Regenerating your ${label} will immediately invalidate the old one. Any application still using it will stop working until you update it. Continue?`
      )
    ) {
      action();
    }
  };

  return (
    <div className="md:ml-[6rem] bg-white p-4 max-w-[600px] mx-auto">
      <h3 className="title text-center mb-4">API Credentials</h3>

      <div className="flex justify-center mb-3">
        <StatusBadge status={myApiCredentials.status} />
      </div>

      <CopyableField label="API User ID" value={myApiCredentials.apiUserId} />
      <CopyableField label="API Key" value={`${myApiCredentials.apiKeyPrefix}••••••••••••••••••`} />

      <p className="text-xs text-red-500 font-bold text-center my-3">
        Keep your API credentials private. Anyone with your credentials can use your API wallet.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button
          className="btn m-0"
          onClick={() => confirmAndRegenerate("API key", regenerateMyApiKey)}
        >
          Regenerate API Key
        </button>
        <button
          className="btn m-0"
          onClick={() => confirmAndRegenerate("API secret", regenerateMyApiSecret)}
        >
          Regenerate Secret
        </button>
      </div>

      <hr className="my-4" />

      <h4 className="font-bold mb-2">Webhook</h4>
      <FormInput
        labelText="Webhook URL"
        name="webhookUrl"
        type="text"
        value={webhookUrl}
        handleChange={(e) => setWebhookUrl(e.target.value)}
        placeholder="https://myapp.com/api/assalam/webhook"
      />
      <div className="flex gap-2 mt-2">
        <button className="btn m-0" onClick={() => updateMyWebhook({ webhookUrl })}>
          Save Webhook
        </button>
        <button className="btn btn-hipster m-0" onClick={testMyWebhook}>
          Test Webhook
        </button>
      </div>
    </div>
  );
};

export default ApiCredentials;
