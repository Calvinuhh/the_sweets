import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Postres", path: "/" },
    { name: "Sobre Nosotros", path: "/about" },
    { name: "Contáctanos", path: "/contact" },
  ];

  return (
    <nav
      className="flex justify-center gap-[100px] w-screen mx-auto font-lato p-4 shadow-lg"
      style={{ backgroundColor: "#b58e63" }}
    >
      {menuItems.map(({ name, path }) => (
        <h1
          key={name}
          onClick={() => navigate(path)}
          className={`cursor-pointer px-6 py-2 text-lg font-semibold rounded-lg transition-all duration-300 
            ${
              location.pathname === path
                ? "bg-white text-[#b58e63] shadow-md"
                : "border-2 border-white text-white hover:bg-[#a37b55] hover:text-white"
            }`}
        >
          {name}
        </h1>
      ))}
    </nav>
  );
};

export default NavBar;
