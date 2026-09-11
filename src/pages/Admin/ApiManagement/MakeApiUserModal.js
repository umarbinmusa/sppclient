import React, { useState } from "react";
import ApiModal from "../../../components/ApiManagement/ApiModal";
import FormRowSelect from "../../../components/FormRowSelect";
import FormInput from "../../../components/FormInput";
import { useApiManagement } from "../../../context/ApiManagementContext";

const TIERS = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const ALL_SERVICES = ["AIRTIME", "DATA", "ELECTRICITY", "CABLE"];

const MakeApiUserModal = ({ user, close }) => {
  const { makeApiUser, isApiLoading } = useApiManagement();
  const [tier, setTier] = useState("STARTER");
  const [allowedServices, setAllowedServices] = useState(ALL_SERVICES);
  const [rateLimit, setRateLimit] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const toggleService = (service) => {
    setAllowedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await makeApiUser(user._id, {
      tier,
      allowedServices,
      rateLimit: rateLimit ? Number(rateLimit) : undefined,
      webhookUrl: webhookUrl || undefined,
    });
    if (result) close();
  };

  return (
    <ApiModal title={`Make ${user.userName} an API User`} onClose={close}>
      <form onSubmit={handleSubmit} className="text-left">
        <FormRowSelect labelText="API Tier" name="tier" value={tier} handleChange={(e) => setTier(e.target.value)} list={TIERS} />

        <p className="text-xs uppercase font-bold text-gray-500 mt-3 mb-1">Allowed services</p>
        <div className="flex flex-wrap gap-3 mb-3">
          {ALL_SERVICES.map((service) => (
            <label key={service} className="flex items-center gap-1 text-sm capitalize">
              <input
                type="checkbox"
                checked={allowedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              {service.toLowerCase()}
            </label>
          ))}
        </div>

        <FormInput
          labelText="Rate limit (requests/min, optional — defaults to tier)"
          name="rateLimit"
          type="number"
          value={rateLimit}
          handleChange={(e) => setRateLimit(e.target.value)}
          placeholder="e.g. 60"
        />
        <FormInput
          labelText="Webhook URL (optional)"
          name="webhookUrl"
          type="text"
          value={webhookUrl}
          handleChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://myapp.com/webhook"
        />

        <button className="btn btn-block mt-3" type="submit" disabled={isApiLoading}>
          {isApiLoading ? "Creating..." : "Create API access"}
        </button>
      </form>
    </ApiModal>
  );
};

export default MakeApiUserModal;
