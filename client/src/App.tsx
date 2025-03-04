import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import About from "./components/About";
import AdminResources from "./views/AdminResources";
import LoginAdmin from "./views/LoginAdmin";
import ContactUs from "./components/ContactUs";
import Desserts from "./components/Desserts";

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Desserts />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
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
