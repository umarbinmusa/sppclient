import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalContext } from "./UserContext";

const ApiManagementAppContext = React.createContext();

const buildQuery = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const ApiManagementProvider = ({ children }) => {
  const { token, logoutUser } = useGlobalContext();

  const apiFetch = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });
  apiFetch.interceptors.request.use((config) => {
    config.headers.common["x-auth-token"] = token;
    return config;
  });
  apiFetch.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) logoutUser();
      return Promise.reject(error);
    }
  );

  const [isApiLoading, setIsApiLoading] = useState(false);

  // ------- Admin: API Users -------
  const [apiUsers, setApiUsers] = useState([]);
  const [apiUsersTotalPages, setApiUsersTotalPages] = useState(1);
  const [apiUsersTotal, setApiUsersTotal] = useState(0);
  const [selectedApiUser, setSelectedApiUser] = useState(null);

  // Whatever key/secret was just issued (creation or regeneration) — shown
  // once in a modal, then the caller should clear it.
  const [issuedCredential, setIssuedCredential] = useState(null);

  const fetchApiUsers = async (filters = {}) => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.get(`/admin/api-management/users${buildQuery(filters)}`);
      setApiUsers(data.apiUsers);
      setApiUsersTotalPages(data.totalPages);
      setApiUsersTotal(data.totalApiUsers);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load API users");
    } finally {
      setIsApiLoading(false);
    }
  };

  const fetchApiUserDetail = async (id) => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.get(`/admin/api-management/users/${id}`);
      setSelectedApiUser({ id, ...data });
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load API user");
    } finally {
      setIsApiLoading(false);
    }
  };

  const makeApiUser = async (userId, config) => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.post(`/admin/api-management/users/${userId}/make-api-user`, config);
      toast.success(data.msg || "API access created");
      setIssuedCredential({ apiUserId: data.apiUserId, apiKey: data.apiKey, apiSecret: data.apiSecret });
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not create API access");
      return null;
    } finally {
      setIsApiLoading(false);
    }
  };

  const updateApiUserStatus = async (id, status) => {
    try {
      const { data } = await apiFetch.patch(`/admin/api-management/users/${id}/status`, { status });
      toast.success(data.msg || "Status updated");
      fetchApiUsers();
      if (selectedApiUser && selectedApiUser.id === id) fetchApiUserDetail(id);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not update status");
    }
  };

  const updateApiUserConfig = async (id, config) => {
    try {
      const { data } = await apiFetch.patch(`/admin/api-management/users/${id}/config`, config);
      toast.success(data.msg || "Configuration updated");
      fetchApiUserDetail(id);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not update configuration");
    }
  };

  const regenerateApiUserKey = async (id) => {
    try {
      const { data } = await apiFetch.post(`/admin/api-management/users/${id}/regenerate-key`);
      setIssuedCredential({ apiKey: data.apiKey });
      toast.success(data.msg || "API key regenerated");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not regenerate API key");
    }
  };

  const regenerateApiUserSecret = async (id) => {
    try {
      const { data } = await apiFetch.post(`/admin/api-management/users/${id}/regenerate-secret`);
      setIssuedCredential({ apiSecret: data.apiSecret });
      toast.success(data.msg || "API secret regenerated");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not regenerate API secret");
    }
  };

  const testApiUserWebhook = async (id) => {
    try {
      const { data } = await apiFetch.post(`/admin/api-management/users/${id}/test-webhook`);
      toast.success(data.msg || "Test webhook sent");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to deliver test webhook");
    }
  };

  const clearIssuedCredential = () => setIssuedCredential(null);

  // ------- Admin: Pricing -------
  const [pricingList, setPricingList] = useState([]);

  const fetchApiPricing = async (filters = {}) => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.get(`/admin/api-management/pricing${buildQuery(filters)}`);
      setPricingList(data.pricing);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load pricing");
    } finally {
      setIsApiLoading(false);
    }
  };

  const upsertApiPricing = async (payload) => {
    try {
      const { data } = await apiFetch.post(`/admin/api-management/pricing`, payload);
      toast.success(data.msg || "Pricing saved");
      fetchApiPricing();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not save pricing");
      return false;
    }
  };

  const deleteApiPricing = async (id) => {
    try {
      const { data } = await apiFetch.delete(`/admin/api-management/pricing/${id}`);
      toast.success(data.msg || "Pricing rule removed");
      fetchApiPricing();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not remove pricing rule");
    }
  };

  // ------- Admin: Tiers -------
  const [tiers, setTiers] = useState([]);

  const fetchApiTiers = async () => {
    try {
      const { data } = await apiFetch.get(`/admin/api-management/tiers`);
      setTiers(data.tiers);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load tiers");
    }
  };

  const upsertApiTier = async (payload) => {
    try {
      const { data } = await apiFetch.post(`/admin/api-management/tiers`, payload);
      toast.success(data.msg || "Tier saved");
      fetchApiTiers();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not save tier");
      return false;
    }
  };

  // ------- Admin: Transactions & Logs -------
  const [apiTransactions, setApiTransactions] = useState([]);
  const [apiTransactionsTotalPages, setApiTransactionsTotalPages] = useState(1);

  const fetchApiTransactions = async (filters = {}) => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.get(`/admin/api-management/transactions${buildQuery(filters)}`);
      setApiTransactions(data.transactions);
      setApiTransactionsTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load API transactions");
    } finally {
      setIsApiLoading(false);
    }
  };

  const [apiLogs, setApiLogs] = useState([]);
  const [apiLogsTotalPages, setApiLogsTotalPages] = useState(1);

  const fetchApiLogs = async (filters = {}) => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.get(`/admin/api-management/logs${buildQuery(filters)}`);
      setApiLogs(data.logs);
      setApiLogsTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load API logs");
    } finally {
      setIsApiLoading(false);
    }
  };

  // ------- Admin: Analytics -------
  const [apiAnalytics, setApiAnalytics] = useState(null);

  const fetchApiAnalytics = async () => {
    try {
      const { data } = await apiFetch.get(`/admin/api-management/analytics`);
      setApiAnalytics(data);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load API analytics");
    }
  };

  // ------- Self-service: logged-in API User -------
  const [myApiDashboard, setMyApiDashboard] = useState(null);
  const [myApiCredentials, setMyApiCredentials] = useState(null);

  const fetchMyApiDashboard = async () => {
    setIsApiLoading(true);
    try {
      const { data } = await apiFetch.get(`/api-user/dashboard`);
      setMyApiDashboard(data);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load your API dashboard");
    } finally {
      setIsApiLoading(false);
    }
  };

  const fetchMyApiCredentials = async () => {
    try {
      const { data } = await apiFetch.get(`/api-user/credentials`);
      setMyApiCredentials(data);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not load your credentials");
    }
  };

  const regenerateMyApiKey = async () => {
    try {
      const { data } = await apiFetch.post(`/api-user/regenerate-key`);
      setIssuedCredential({ apiKey: data.apiKey });
      toast.success(data.msg || "API key regenerated");
      fetchMyApiCredentials();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not regenerate API key");
    }
  };

  const regenerateMyApiSecret = async () => {
    try {
      const { data } = await apiFetch.post(`/api-user/regenerate-secret`);
      setIssuedCredential({ apiSecret: data.apiSecret });
      toast.success(data.msg || "API secret regenerated");
      fetchMyApiCredentials();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not regenerate API secret");
    }
  };

  const updateMyWebhook = async (payload) => {
    try {
      const { data } = await apiFetch.post(`/api-user/webhook`, payload);
      toast.success(data.msg || "Webhook settings saved");
      fetchMyApiCredentials();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Could not save webhook settings");
      return false;
    }
  };

  const testMyWebhook = async () => {
    try {
      const { data } = await apiFetch.post(`/api-user/webhook/test`);
      toast.success(data.msg || "Test webhook sent");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to deliver test webhook. Check your webhook URL.");
    }
  };

  return (
    <ApiManagementAppContext.Provider
      value={{
        isApiLoading,
        // admin: api users
        apiUsers,
        apiUsersTotalPages,
        apiUsersTotal,
        selectedApiUser,
        setSelectedApiUser,
        issuedCredential,
        clearIssuedCredential,
        fetchApiUsers,
        fetchApiUserDetail,
        makeApiUser,
        updateApiUserStatus,
        updateApiUserConfig,
        regenerateApiUserKey,
        regenerateApiUserSecret,
        testApiUserWebhook,
        // admin: pricing
        pricingList,
        fetchApiPricing,
        upsertApiPricing,
        deleteApiPricing,
        // admin: tiers
        tiers,
        fetchApiTiers,
        upsertApiTier,
        // admin: transactions & logs
        apiTransactions,
        apiTransactionsTotalPages,
        fetchApiTransactions,
        apiLogs,
        apiLogsTotalPages,
        fetchApiLogs,
        // admin: analytics
        apiAnalytics,
        fetchApiAnalytics,
        // self-service
        myApiDashboard,
        fetchMyApiDashboard,
        myApiCredentials,
        fetchMyApiCredentials,
        regenerateMyApiKey,
        regenerateMyApiSecret,
        updateMyWebhook,
        testMyWebhook,
      }}
    >
      {children}
    </ApiManagementAppContext.Provider>
  );
};

export const useApiManagement = () => useContext(ApiManagementAppContext);
