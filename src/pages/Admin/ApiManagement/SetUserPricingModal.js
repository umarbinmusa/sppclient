import React, { useEffect, useState } from "react";
import ApiModal from "../../../components/ApiManagement/ApiModal";
import FormRowSelect from "../../../components/FormRowSelect";
import FormInput from "../../../components/FormInput";
import { useGlobalContext } from "../../../context/UserContext";

const SERVICES = ["AIRTIME", "DATA", "ELECTRICITY"];
const NETWORKS = ["MTN", "AIRTEL", "GLO", "9MOBILE"];

const SetUserPricingModal = ({ user, close }) => {
  const {
    dataSubScriptions,
    userPricingList,
    fetchUserPricing,
    setUserPricing,
    deleteUserPricing,
  } = useGlobalContext();

  const [service, setService] = useState("AIRTIME");
  const [network, setNetwork] = useState("MTN");
  const [dataId, setDataId] = useState("");
  const [pricingType, setPricingType] = useState("PERCENTAGE");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchUserPricing(user._id);
    // eslint-disable-next-line
  }, [user._id]);

  useEffect(() => {
    // AIRTIME is always a % of face value; DATA/ELECTRICITY are a fixed ₦ amount.
    setPricingType(service === "AIRTIME" ? "PERCENTAGE" : "FIXED");
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await setUserPricing(user._id, {
      service,
      network: service === "AIRTIME" ? network : undefined,
      dataId: service === "DATA" ? Number(dataId) : undefined,
      pricingType,
      price: Number(price),
    });
    if (ok) setPrice("");
  };

  const describeRule = (rule) => {
    if (rule.service === "AIRTIME") return `Airtime — ${rule.network}`;
    if (rule.service === "DATA") {
      const plan = dataSubScriptions.find((p) => p.id === rule.dataId);
      return plan
        ? `Data — ${plan.plan_network} ${plan.plan} ${plan.plan_type}`
        : `Data — plan #${rule.dataId}`;
    }
    return "Electricity fee";
  };

  return (
    <ApiModal title={`Custom pricing for ${user.userName}`} onClose={close}>
      <form onSubmit={handleSubmit} className="text-left">
        <FormRowSelect
          labelText="Service"
          name="service"
          value={service}
          handleChange={(e) => setService(e.target.value)}
          list={SERVICES}
        />
        {service === "AIRTIME" && (
          <FormRowSelect
            labelText="Network"
            name="network"
            value={network}
            handleChange={(e) => setNetwork(e.target.value)}
            list={NETWORKS}
          />
        )}
        {service === "DATA" && (
          <div className="form-row text-black">
            <label className="form-label">Data plan</label>
            <select
              name="dataId"
              className="form-select capitalize"
              value={dataId}
              onChange={(e) => setDataId(e.target.value)}
            >
              <option value="">Select a plan</option>
              {dataSubScriptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.plan_network} {p.plan} {p.plan_type} — ₦{p.plan_amount}
                </option>
              ))}
            </select>
          </div>
        )}
        <FormInput
          labelText={pricingType === "PERCENTAGE" ? "Price (% of face value)" : "Price (₦)"}
          name="price"
          type="number"
          value={price}
          handleChange={(e) => setPrice(e.target.value)}
          placeholder={pricingType === "PERCENTAGE" ? "e.g. 97" : "e.g. 300"}
        />
        <button className="btn btn-block mt-2" type="submit">
          Save custom price
        </button>
      </form>

      <hr className="my-3" />
      <p className="text-xs uppercase font-bold text-gray-500 mb-2">
        Existing custom prices for this user
      </p>
      {userPricingList.length === 0 && (
        <p className="text-sm text-center text-gray-500">
          None yet — this user pays the normal rate for their account type.
        </p>
      )}
      {userPricingList.map((rule) => (
        <div key={rule._id} className="flex justify-between items-center bg-gray-100 rounded-md p-2 mb-2">
          <span className="text-sm">
            {describeRule(rule)} —{" "}
            <b>{rule.pricingType === "PERCENTAGE" ? `${rule.price}%` : `₦${rule.price}`}</b>
          </span>
          <button
            type="button"
            className="btn btn-danger m-0 px-2 py-1"
            onClick={() => deleteUserPricing(user._id, rule._id)}
          >
            Remove
          </button>
        </div>
      ))}
    </ApiModal>
  );
};

export default SetUserPricingModal;
