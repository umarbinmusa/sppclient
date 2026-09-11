import React, { useEffect, useState } from "react";
import { TableContainer } from "../../../Styles/Styles";
import FormRowSelect from "../../../components/FormRowSelect";
import FormInput from "../../../components/FormInput";
import { useApiManagement } from "../../../context/ApiManagementContext";

const SCOPES = ["DEFAULT", "TIER", "USER"];
const TIERS = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];
const SERVICES = ["AIRTIME", "DATA", "ELECTRICITY", "CABLE"];
const NETWORKS = ["MTN", "AIRTEL", "GLO", "9MOBILE"];
const PRICING_TYPES = ["PERCENTAGE", "FIXED"];

const emptyForm = {
  scope: "DEFAULT",
  tier: "STARTER",
  apiUser: "",
  service: "AIRTIME",
  network: "MTN",
  planCode: "",
  pricingType: "PERCENTAGE",
  price: "",
};

const ApiPricingManager = () => {
  const { pricingList, fetchApiPricing, upsertApiPricing, deleteApiPricing } = useApiManagement();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchApiPricing();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await upsertApiPricing({
      ...form,
      apiUser: form.scope === "USER" ? form.apiUser : undefined,
      tier: form.scope === "TIER" ? form.tier : undefined,
      network: form.service === "ELECTRICITY" ? undefined : form.network || undefined,
      planCode: form.service === "DATA" ? form.planCode || undefined : undefined,
      price: Number(form.price),
    });
    if (ok) setForm(emptyForm);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card p-4 mb-4 text-left max-w-[500px] mx-auto">
        <h4 className="title text-center mb-2">Set API pricing</h4>
        <FormRowSelect labelText="Scope" name="scope" value={form.scope} handleChange={handleChange} list={SCOPES} />
        {form.scope === "TIER" && (
          <FormRowSelect labelText="Tier" name="tier" value={form.tier} handleChange={handleChange} list={TIERS} />
        )}
        {form.scope === "USER" && (
          <FormInput
            labelText="API User Mongo ID"
            name="apiUser"
            value={form.apiUser}
            handleChange={handleChange}
            placeholder="ApiAccess _id"
          />
        )}
        <FormRowSelect labelText="Service" name="service" value={form.service} handleChange={handleChange} list={SERVICES} />
        {form.service !== "ELECTRICITY" && (
          <FormRowSelect
            labelText="Network (optional)"
            name="network"
            value={form.network}
            handleChange={handleChange}
            list={["", ...NETWORKS]}
          />
        )}
        {form.service === "DATA" && (
          <FormInput
            labelText="Plan code (dataplan_id)"
            name="planCode"
            value={form.planCode}
            handleChange={handleChange}
            placeholder="e.g. 102"
          />
        )}
        <FormRowSelect
          labelText="Pricing type"
          name="pricingType"
          value={form.pricingType}
          handleChange={handleChange}
          list={PRICING_TYPES}
        />
        <FormInput
          labelText={form.pricingType === "PERCENTAGE" ? "Price (% of face value)" : "Price (₦)"}
          name="price"
          type="number"
          value={form.price}
          handleChange={handleChange}
          placeholder={form.pricingType === "PERCENTAGE" ? "e.g. 99" : "e.g. 330"}
        />
        <button className="btn btn-block mt-2" type="submit">
          Save pricing rule
        </button>
      </form>

      <TableContainer>
        <table className="table-auto m-auto" id="t01">
          <thead>
            <tr>
              <th>Scope</th>
              <th>Tier/User</th>
              <th>Service</th>
              <th>Network</th>
              <th>Plan</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pricingList.map((p) => (
              <tr key={p._id}>
                <td>{p.scope}</td>
                <td className="text-xs">{p.tier || p.apiUser || "-"}</td>
                <td>{p.service}</td>
                <td>{p.network || "-"}</td>
                <td>{p.planCode || "-"}</td>
                <td>{p.pricingType === "PERCENTAGE" ? `${p.price}%` : `₦${p.price}`}</td>
                <td>
                  <button className="btn btn-danger m-0 px-2 py-1" onClick={() => deleteApiPricing(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pricingList.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No pricing rules yet — defaults/fallbacks apply.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
};

export default ApiPricingManager;
