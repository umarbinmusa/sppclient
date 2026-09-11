import React, { useEffect, useState } from "react";
import ApiModal from "../../../components/ApiManagement/ApiModal";
import StatusBadge from "../../../components/ApiManagement/StatusBadge";
import FormRowSelect from "../../../components/FormRowSelect";
import FormInput from "../../../components/FormInput";
import { useApiManagement } from "../../../context/ApiManagementContext";

const TIERS = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const ALL_SERVICES = ["AIRTIME", "DATA", "ELECTRICITY", "CABLE"];
const TABS = ["Overview", "Config", "Webhook"];

const ApiUserDetailModal = ({ id, close }) => {
  const {
    selectedApiUser,
    fetchApiUserDetail,
    updateApiUserStatus,
    updateApiUserConfig,
    regenerateApiUserKey,
    regenerateApiUserSecret,
    testApiUserWebhook,
  } = useApiManagement();
  const [tab, setTab] = useState("Overview");
  const [tier, setTier] = useState("STARTER");
  const [allowedServices, setAllowedServices] = useState(ALL_SERVICES);
  const [rateLimit, setRateLimit] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    fetchApiUserDetail(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (selectedApiUser && selectedApiUser.id === id) {
      setTier(selectedApiUser.tier);
      setAllowedServices(selectedApiUser.allowedServices || []);
      setRateLimit(selectedApiUser.rateLimit || "");
      setWebhookUrl(selectedApiUser.webhookUrl || "");
    }
    // eslint-disable-next-line
  }, [selectedApiUser]);

  const toggleService = (service) => {
    setAllowedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  if (!selectedApiUser || selectedApiUser.id !== id) {
    return (
      <ApiModal title="API User" onClose={close}>
        <p className="text-center">Loading...</p>
      </ApiModal>
    );
  }

  const d = selectedApiUser;

  return (
    <ApiModal title={d.apiUserId || "API User"} onClose={close} wide>
      <div className="flex gap-2 mb-3 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`btn m-0 ${tab === t ? "" : "btn-hipster"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="text-sm">
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Status</span>
            <StatusBadge status={d.status} />
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">API User ID</span>
            <span>{d.apiUserId}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Key prefix</span>
            <span className="font-mono">{d.apiKeyPrefix}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">User</span>
            <span>{d.user?.fullName || d.user?.userName}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Wallet</span>
            <span>₦{d.user?.balance?.toFixed?.(2) ?? d.user?.balance}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Tier</span>
            <span>{d.tier}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Total requests</span>
            <span>{d.totalRequests}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Successful transactions</span>
            <span>{d.successfulTransactions}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Failed transactions</span>
            <span>{d.failedTransactions}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span className="font-bold">Total API revenue</span>
            <span>₦{d.totalApiRevenue?.toFixed?.(2) ?? d.totalApiRevenue}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {d.status !== "ACTIVE" && (
              <button className="btn m-0" onClick={() => updateApiUserStatus(id, "ACTIVE")}>
                Activate
              </button>
            )}
            {d.status !== "SUSPENDED" && (
              <button className="btn btn-hipster m-0" onClick={() => updateApiUserStatus(id, "SUSPENDED")}>
                Suspend
              </button>
            )}
            {d.status !== "REVOKED" && (
              <button className="btn btn-danger m-0" onClick={() => updateApiUserStatus(id, "REVOKED")}>
                Revoke
              </button>
            )}
            <button className="btn m-0" onClick={() => regenerateApiUserKey(id)}>
              Regenerate key
            </button>
            <button className="btn m-0" onClick={() => regenerateApiUserSecret(id)}>
              Regenerate secret
            </button>
          </div>
        </div>
      )}

      {tab === "Config" && (
        <div className="text-left">
          <FormRowSelect labelText="Tier" name="tier" value={tier} handleChange={(e) => setTier(e.target.value)} list={TIERS} />
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
            labelText="Rate limit override (requests/min)"
            name="rateLimit"
            type="number"
            value={rateLimit}
            handleChange={(e) => setRateLimit(e.target.value)}
          />
          <button
            className="btn btn-block mt-2"
            onClick={() =>
              updateApiUserConfig(id, {
                tier,
                allowedServices,
                rateLimit: rateLimit ? Number(rateLimit) : null,
              })
            }
          >
            Save configuration
          </button>
        </div>
      )}

      {tab === "Webhook" && (
        <div className="text-left">
          <FormInput
            labelText="Webhook URL"
            name="webhookUrl"
            type="text"
            value={webhookUrl}
            handleChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://myapp.com/webhook"
          />
          <div className="flex gap-2 mt-2">
            <button className="btn m-0" onClick={() => updateApiUserConfig(id, { webhookUrl })}>
              Save webhook
            </button>
            <button className="btn btn-hipster m-0" onClick={() => testApiUserWebhook(id)}>
              Test webhook
            </button>
          </div>
        </div>
      )}
    </ApiModal>
  );
};

export default ApiUserDetailModal;
