import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Desserts from "../components/desserts/Desserts";
import Orders from "../components/orders/Orders";
import { useNavigate } from "react-router-dom";

const AdminResources = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("postres");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");
    const currentTime = new Date().getTime();

    if (
      !token ||
      !tokenTimestamp ||
      currentTime - parseInt(tokenTimestamp) > 900000
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");

      navigate(`/${import.meta.env.VITE_ADMIN_ENDPOINT}`, { replace: true });
      return;
    }
  }, [navigate]);

  return (
    <>
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "postres" ? <Desserts /> : <Orders />}
    </>
  );
};

export default AdminResources;
