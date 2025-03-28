import LogoutBtn from "./LogoutBtn";

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNav: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  const getIndicatorPosition = () => {
    switch (activeTab) {
      case "postres":
        return "translate-x-[1px]";
      case "adiciones":
        return "translate-x-[126px]";
      case "ordenes":
        return "translate-x-[265px]";
      default:
        return "translate-x-[1px]";
    }
  };

  return (
    <div className="bg-rose-300 h-[200px] flex items-center justify-around relative">
      <img src="/logo.png" alt="logo" className="w-[190px] h-[180px]" />

      <div className="flex pt-[90px] gap-[50px] font-lato text-[21px]">
        <div
          className={`flex flex-col items-center transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110 active:scale-95 ${
            activeTab === "postres" ? "pointer-events-none" : ""
          }`}
          onClick={() => activeTab !== "postres" && setActiveTab("postres")}
        >
          <img
            className="w-[30px]"
            src="/dessert_icon.webp"
            alt="desserts_logo"
          />
          <h2>Postres</h2>
        </div>

        <div
          className={`flex flex-col items-center transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110 active:scale-95 ${
            activeTab === "adiciones" ? "pointer-events-none" : ""
          }`}
          onClick={() => activeTab !== "adiciones" && setActiveTab("adiciones")}
        >
          <img
            className="w-[43px] h-[50px]"
            src="/additions_icon.webp"
            alt="additions_logo"
          />
          <h2>Adiciones</h2>
        </div>

        <div
          className={`flex flex-col items-center transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110 active:scale-95 ${
            activeTab === "ordenes" ? "pointer-events-none" : ""
          }`}
          onClick={() => activeTab !== "ordenes" && setActiveTab("ordenes")}
        >
          <img className="w-[43px]" src="/orders_icon.webp" alt="orders_logo" />
          <h2>Órdenes</h2>
        </div>

        <div
          className={`absolute w-[70px] h-[7px] bg-[#b58e63] bottom-[1px] transition-all duration-300 ease-in-out ${getIndicatorPosition()}`}
        ></div>
      </div>

      <LogoutBtn />
    </div>
  );
};

export default AdminNav;
