import React, { useState } from "react";
import ApiUsersList from "./ApiUsersList";
import ApiPricingManager from "./ApiPricingManager";
import ApiTiersManager from "./ApiTiersManager";
import ApiTransactionsPanel from "./ApiTransactionsPanel";
import ApiLogsPanel from "./ApiLogsPanel";
import ApiAnalyticsPanel from "./ApiAnalyticsPanel";

const TABS = [
  { key: "analytics", label: "Overview" },
  { key: "users", label: "API Users" },
  { key: "pricing", label: "API Pricing" },
  { key: "tiers", label: "API Tiers" },
  { key: "transactions", label: "API Transactions" },
  { key: "logs", label: "API Logs" },
];

const ApiManagementHub = () => {
  const [tab, setTab] = useState("analytics");

  return (
    <div className="md:ml-[6rem] bg-white p-4">
      <h3 className="title text-center mb-3">API Management</h3>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`btn m-0 ${tab === t.key ? "" : "btn-hipster"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "analytics" && <ApiAnalyticsPanel />}
      {tab === "users" && <ApiUsersList />}
      {tab === "pricing" && <ApiPricingManager />}
      {tab === "tiers" && <ApiTiersManager />}
      {tab === "transactions" && <ApiTransactionsPanel />}
      {tab === "logs" && <ApiLogsPanel />}
    </div>
  );
};

export default ApiManagementHub;
