import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./views/Home";
import About from "./views/About";
import AdminResources from "./views/AdminResources";
import LoginAdmin from "./views/LoginAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route
          path={`${import.meta.env.VITE_ADMIN_ENDPOINT}`}
          element={<LoginAdmin />}
        />
        <Route path="/admin" element={<AdminResources />} />
      </Routes>
    </>
  );
}

export default App;
