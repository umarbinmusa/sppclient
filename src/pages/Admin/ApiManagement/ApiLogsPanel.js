import React, { useEffect, useState } from "react";
import moment from "moment";
import { TableContainer } from "../../../Styles/Styles";
import { useApiManagement } from "../../../context/ApiManagementContext";

const ApiLogsPanel = () => {
  const { apiLogs, apiLogsTotalPages, fetchApiLogs, isApiLoading } = useApiManagement();
  const [endpoint, setEndpoint] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchApiLogs({ endpoint, page });
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApiLogs({ endpoint, page: 1 });
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-end mb-3">
        <input
          className="form-input"
          placeholder="Filter by endpoint, e.g. airtime"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <button className="btn m-0" type="submit">
          Search
        </button>
      </form>

      <TableContainer>
        <table className="table-auto m-auto" id="t01">
          <thead>
            <tr>
              <th>API User</th>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Response time</th>
              <th>IP</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isApiLoading && (
              <tr>
                <td colSpan={7} className="text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!isApiLoading &&
              apiLogs.map((log) => (
                <tr key={log._id}>
                  <td className="font-mono text-xs">{log.apiUser?.apiUserId || "-"}</td>
                  <td>{log.method}</td>
                  <td className="text-xs">{log.endpoint}</td>
                  <td className={log.success ? "text-green-600" : "text-red-600"}>{log.statusCode}</td>
                  <td>{log.responseTimeMs}ms</td>
                  <td className="text-xs">{log.ipAddress}</td>
                  <td className="text-xs text-gray-400">{moment(log.createdAt).fromNow()}</td>
                </tr>
              ))}
            {!isApiLoading && apiLogs.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No API request logs match this filter.
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
          Page {page} of {apiLogsTotalPages || 1}
        </span>
        <button className="btn m-0" disabled={page >= apiLogsTotalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ApiLogsPanel;
