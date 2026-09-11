import React, { useEffect, useState } from "react";
import moment from "moment";
import { TableContainer } from "../../../Styles/Styles";
import StatusBadge from "../../../components/ApiManagement/StatusBadge";
import { useApiManagement } from "../../../context/ApiManagementContext";

const SERVICES = ["", "AIRTIME", "DATA", "ELECTRICITY", "CABLE"];
const STATUSES = ["", "PENDING", "SUCCESS", "FAILED", "REFUNDED"];

const ApiTransactionsPanel = () => {
  const { apiTransactions, apiTransactionsTotalPages, fetchApiTransactions, isApiLoading } = useApiManagement();
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchApiTransactions({ service, status, page });
    // eslint-disable-next-line
  }, [service, status, page]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-end mb-3">
        <select className="form-select" value={service} onChange={(e) => { setPage(1); setService(e.target.value); }}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s || "All services"}
            </option>
          ))}
        </select>
        <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s || "All statuses"}
            </option>
          ))}
        </select>
      </div>

      <TableContainer>
        <table className="table-auto m-auto" id="t01">
          <thead>
            <tr>
              <th>API User</th>
              <th>Transaction ID</th>
              <th>Request ID</th>
              <th>Service</th>
              <th>Network</th>
              <th>Amount</th>
              <th>Charged</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isApiLoading && (
              <tr>
                <td colSpan={9} className="text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!isApiLoading &&
              apiTransactions.map((t) => (
                <tr key={t._id}>
                  <td className="font-mono text-xs">{t.apiUser?.apiUserId || "-"}</td>
                  <td className="font-mono text-xs">{t.transactionId}</td>
                  <td className="text-xs">{t.requestId || "-"}</td>
                  <td>{t.service}</td>
                  <td>{t.network || "-"}</td>
                  <td>₦{t.amount}</td>
                  <td>₦{t.chargedAmount}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="text-xs text-gray-400">{moment(t.createdAt).fromNow()}</td>
                </tr>
              ))}
            {!isApiLoading && apiTransactions.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center">
                  No API transactions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>

      <div className="flex justify-center gap-3 mt-3">
        <button className="btn m-0" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span className="self-center text-sm">
          Page {page} of {apiTransactionsTotalPages || 1}
        </span>
        <button
          className="btn m-0"
          disabled={page >= apiTransactionsTotalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ApiTransactionsPanel;
