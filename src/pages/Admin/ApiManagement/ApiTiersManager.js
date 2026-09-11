import React, { useEffect, useState } from "react";
import FormRowSelect from "../../../components/FormRowSelect";
import FormInput from "../../../components/FormInput";
import { useApiManagement } from "../../../context/ApiManagementContext";

const TIER_NAMES = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];

const ApiTiersManager = () => {
  const { tiers, fetchApiTiers, upsertApiTier } = useApiManagement();
  const [form, setForm] = useState({ name: "STARTER", rateLimit: "", description: "", isCustomPricing: false });

  useEffect(() => {
    fetchApiTiers();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await upsertApiTier({ ...form, rateLimit: Number(form.rateLimit) });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card p-4 mb-4 text-left max-w-[500px] mx-auto">
        <h4 className="title text-center mb-2">Configure a tier</h4>
        <FormRowSelect
          labelText="Tier"
          name="name"
          value={form.name}
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
          list={TIER_NAMES}
        />
        <FormInput
          labelText="Default rate limit (requests/min)"
          name="rateLimit"
          type="number"
          value={form.rateLimit}
          handleChange={(e) => setForm({ ...form, rateLimit: e.target.value })}
        />
        <FormInput
          labelText="Description"
          name="description"
          value={form.description}
          handleChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm my-2">
          <input
            type="checkbox"
            checked={form.isCustomPricing}
            onChange={(e) => setForm({ ...form, isCustomPricing: e.target.checked })}
          />
          Custom pricing only (e.g. Enterprise)
        </label>
        <button className="btn btn-block" type="submit">
          Save tier
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-3">
        {tiers.map((t) => (
          <div key={t._id} className="card w-[45%] max-w-[220px]">
            <h4 className="title">{t.name}</h4>
            <p>{t.rateLimit} req/min</p>
            {t.description && <p className="text-xs">{t.description}</p>}
            {t.isCustomPricing && <p className="text-xs text-red-500">Custom pricing</p>}
          </div>
        ))}
        {tiers.length === 0 && <p>No tiers configured yet — fallback defaults apply.</p>}
      </div>
    </div>
  );
};

export default ApiTiersManager;
