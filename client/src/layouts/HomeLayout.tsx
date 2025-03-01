import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const HomeLayout = () => {
  return (
    <>
      <div className="relative flex w-screen h-[230px] bg-[#c3ac83] items-center bg-[url('/desserts2.webp')] bg-center bg-cover">
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className=" flex w-[1200px] gap-[50px] mx-auto justify-between items-center z-10 text-center text-white">
          <div>
            <h1 className="font-moon text-[60px] font-semibold">The Sweet S</h1>
            <h1 className="font-moon text-[60px] font-semibold">Desserts</h1>
          </div>
          <NavBar />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default HomeLayout;
