import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className=" w-screen h-[200px] bg-[#c3ac83]">
      <Outlet />
    </div>
  );
};

export default HomeLayout;
