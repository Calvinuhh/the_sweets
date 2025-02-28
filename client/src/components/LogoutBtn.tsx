import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTimestamp");
    navigate(`/${import.meta.env.VITE_ADMIN_ENDPOINT}`, { replace: true });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="absolute top-7 right-10 bg-[#ddccab] px-3 py-2 rounded-xl font-lato border border-[#b49c7a] shadow-[0px_5px_15px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out cursor-pointer hover:bg-[#c3ac83] hover:scale-110 active:scale-95"
      >
        Cerrar Sesión
      </button>
    </>
  );
};

export default LogoutBtn;
