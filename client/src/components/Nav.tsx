import LogoutBtn from "./LogoutBtn";

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Nav: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
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
            activeTab === "ordenes" ? "pointer-events-none" : ""
          }`}
          onClick={() => activeTab !== "ordenes" && setActiveTab("ordenes")}
        >
          <img
            className="w-[43px]"
            src="/orders_icon.webp"
            alt="desserts_logo"
          />
          <h2>Ordenes</h2>
        </div>
        <div
          className={`absolute w-[70px] h-[7px] bg-[#b58e63] bottom-[1px] transition-all duration-300 ease-in-out ${
            activeTab === "postres"
              ? "translate-x-[1px]"
              : "translate-x-[124px]"
          }`}
        ></div>
      </div>

      <LogoutBtn />
    </div>
  );
};

export default Nav;
