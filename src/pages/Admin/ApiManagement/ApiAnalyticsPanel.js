import React, { useEffect } from "react";
import { useApiManagement } from "../../../context/ApiManagementContext";

const StatCard = ({ label, value }) => (
  <div className="card p-4 text-center min-w-[140px] flex-1">
    <p className="text-xs uppercase font-bold text-gray-500 mb-1">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const ApiAnalyticsPanel = () => {
  const { apiAnalytics, fetchApiAnalytics } = useApiManagement();

  useEffect(() => {
    fetchApiAnalytics();
    // eslint-disable-next-line
  }, []);

  if (!apiAnalytics) return <p className="text-center">Loading...</p>;

  return (
    <div>
      <h4 className="title text-center mb-3">API Business Overview</h4>
      <div className="flex flex-wrap gap-3 mb-3">
        <StatCard label="API Users" value={apiAnalytics.apiUsers} />
        <StatCard label="Active API Users" value={apiAnalytics.activeApiUsers} />
        <StatCard label="Transactions Today" value={apiAnalytics.apiTransactionsToday} />
      </div>
      <div className="flex flex-wrap gap-3 mb-3">
        <StatCard label="Revenue Today" value={`₦${apiAnalytics.apiRevenueToday?.toLocaleString?.() ?? apiAnalytics.apiRevenueToday}`} />
        <StatCard
          label="Revenue This Month"
          value={`₦${apiAnalytics.apiRevenueThisMonth?.toLocaleString?.() ?? apiAnalytics.apiRevenueThisMonth}`}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <StatCard label="Successful Transactions" value={apiAnalytics.successfulTransactionsRate} />
        <StatCard label="Failed Transactions" value={apiAnalytics.failedTransactionsRate} />
      </div>
    </div>
  );
};

export default ApiAnalyticsPanel;
