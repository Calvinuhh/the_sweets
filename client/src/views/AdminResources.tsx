import { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import DessertsAdmin from "../components/dessertsAdmin/DessertsAdmin";
import OrdersAdmin from "../components/ordersAdmin/OrdersAdmin";
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
      currentTime - parseInt(tokenTimestamp) > 1800000
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");

      navigate(`/${import.meta.env.VITE_ADMIN_ENDPOINT}`, { replace: true });
      return;
    }
  }, [navigate]);

  return (
    <>
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "postres" ? <DessertsAdmin /> : <OrdersAdmin />}
    </>
  );
};

export default AdminResources;
