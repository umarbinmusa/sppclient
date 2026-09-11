import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import StatusBadge from "../components/ApiManagement/StatusBadge";
import { useApiManagement } from "../context/ApiManagementContext";

const StatCard = ({ label, value }) => (
  <div className="card p-3 text-center flex-1 min-w-[120px]">
    <p className="text-xs uppercase font-bold text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const ApiDashboard = () => {
  const { myApiDashboard, fetchMyApiDashboard, isApiLoading } = useApiManagement();

  useEffect(() => {
    fetchMyApiDashboard();
    // eslint-disable-next-line
  }, []);

  if (isApiLoading && !myApiDashboard) {
    return <p className="text-center md:ml-[6rem]">Loading your API dashboard...</p>;
  }

  if (!myApiDashboard) {
    return (
      <div className="md:ml-[6rem] p-4 text-center">
        <p>You don't have API access yet.</p>
        <p className="text-sm text-gray-500">
          Ask an administrator to convert your account into an API User to get started.
        </p>
      </div>
    );
  }

  const d = myApiDashboard;

  return (
    <div className="md:ml-[6rem] bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="title">API Dashboard</h3>
        <Link to="/profile/api-credentials" className="btn m-0">
          View credentials
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <StatCard label="Wallet Balance" value={`₦${d.walletBalance?.toFixed?.(2) ?? d.walletBalance}`} />
        <StatCard label="API Status" value={<StatusBadge status={d.apiStatus} />} />
        <StatCard label="Tier" value={d.tier} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <StatCard label="API Requests" value={d.totalApiRequests} />
        <StatCard label="Successful" value={d.successfulRequests} />
        <StatCard label="Failed" value={d.failedRequests} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <StatCard label="API Transactions" value={d.totalApiTransactions} />
        <StatCard label="Total API Spend" value={`₦${d.totalApiSpend?.toFixed?.(2) ?? d.totalApiSpend}`} />
      </div>

      <h4 className="font-bold mt-4 mb-2">Recent API Transactions</h4>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Transaction ID</th>
              <th className="text-left">Service</th>
              <th className="text-left">Network</th>
              <th className="text-left">Charged</th>
              <th className="text-left">Status</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {d.recentTransactions?.map((t) => (
              <tr key={t.transactionId} className="even:bg-gray-50">
                <td className="font-mono text-xs py-1">{t.transactionId}</td>
                <td>{t.service}</td>
                <td>{t.network || "-"}</td>
                <td>₦{t.charged}</td>
                <td>
                  <StatusBadge status={t.status} />
                </td>
                <td className="text-xs text-gray-400">{moment(t.createdAt).fromNow()}</td>
              </tr>
            ))}
            {(!d.recentTransactions || d.recentTransactions.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  No API transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiDashboard;
