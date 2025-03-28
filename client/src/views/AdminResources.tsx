import { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import DessertsAdmin from "../components/dessertsAdmin/DessertsAdmin";
import OrdersAdmin from "../components/ordersAdmin/OrdersAdmin";
import AdditionsAdmin from "../components/additionsAdmin/AdditionsAdmin";
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
      currentTime - parseInt(tokenTimestamp) > 3600000
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");

      navigate(`/${import.meta.env.VITE_ADMIN_ENDPOINT}`, { replace: true });
      return;
    }
  }, [navigate]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "postres":
        return <DessertsAdmin />;
      case "adiciones":
        return <AdditionsAdmin />;
      case "ordenes":
        return <OrdersAdmin />;
      default:
        return <DessertsAdmin />;
    }
  };

  return (
    <>
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActiveTab()}
    </>
  );
};

export default AdminResources;
