import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import About from "./components/About";
import AdminResources from "./views/AdminResources";
import UpdateAdditions from "./components/dessertsAdmin/UpdateAdditions";
import LoginAdmin from "./views/LoginAdmin";
import ContactUs from "./components/ContactUs";
import Desserts from "./components/Desserts";
import DessertDetail from "./components/DessertDetail";
import Checkout from "./components/Checkout";
import { CartProvider } from "./components/CartContext";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Desserts />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/desserts/:id" element={<DessertDetail />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route
          path={`${import.meta.env.VITE_ADMIN_ENDPOINT}`}
          element={<LoginAdmin />}
        />
        <Route path="/admin" element={<AdminResources />} />
        <Route path="/admin/:id" element={<UpdateAdditions />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
