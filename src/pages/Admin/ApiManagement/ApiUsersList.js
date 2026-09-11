import React, { useEffect, useState } from "react";
import moment from "moment";
import { TableContainer } from "../../../Styles/Styles";
import StatusBadge from "../../../components/ApiManagement/StatusBadge";
import ApiUserDetailModal from "./ApiUserDetailModal";
import { useApiManagement } from "../../../context/ApiManagementContext";

const ApiUsersList = () => {
  const { apiUsers, apiUsersTotal, fetchApiUsers, isApiLoading } = useApiManagement();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [viewingId, setViewingId] = useState(null);

  useEffect(() => {
    fetchApiUsers({ status, search });
    // eslint-disable-next-line
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApiUsers({ status, search });
  };

  return (
    <div>
      {viewingId && <ApiUserDetailModal id={viewingId} close={() => setViewingId(null)} />}

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-end mb-3">
        <input
          className="form-input"
          placeholder="Search API User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="REVOKED">Revoked</option>
        </select>
        <button className="btn m-0" type="submit">
          Search
        </button>
      </form>

      <p className="mb-2 font-bold">{apiUsersTotal} API users</p>

      <TableContainer>
        <table className="table-auto m-auto" id="t01">
          <thead>
            <tr>
              <th>Name</th>
              <th>API ID</th>
              <th>Wallet</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Requests</th>
              <th></th>
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
              apiUsers.map((u) => (
                <tr key={u.id} onClick={() => setViewingId(u.id)} className="cursor-pointer">
                  <td>{u.name}</td>
                  <td className="font-mono text-xs">{u.apiUserId}</td>
                  <td>₦{u.wallet?.toFixed?.(2) ?? u.wallet}</td>
                  <td>{u.tier}</td>
                  <td>
                    <StatusBadge status={u.status} />
                  </td>
                  <td>{u.totalRequests}</td>
                  <td className="text-xs text-gray-400">{moment(u.createdAt).fromNow()}</td>
                </tr>
              ))}
            {!isApiLoading && apiUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No API users yet — make one from the Users page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
};

export default ApiUsersList;
