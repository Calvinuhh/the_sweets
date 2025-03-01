import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const HomeLayout = () => {
  return (
    <>
      <div className=" flex w-screen h-[200px] bg-[#c3ac83] items-center">
        <div className=" mx-auto">
          <h1 className=" font-moon text-[60px] font-semibold">The Sweet S</h1>
          <h1 className=" font-moon text-[60px] font-semibold">Desserts</h1>
          <NavBar />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default HomeLayout;
