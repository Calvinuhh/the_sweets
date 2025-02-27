import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Admin from "./views/Admin";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
