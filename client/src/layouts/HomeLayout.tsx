import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

const HomeLayout = () => {
  return (
    <>
      <Header />
      <NavBar />
      <Outlet />
    </>
  );
};

export default HomeLayout;
