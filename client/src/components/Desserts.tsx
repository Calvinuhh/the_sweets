import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Cards from "./Cards";
import axios from "axios";

const Desserts = () => {
  const [desserts, setDesserts] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | "">("");

  const fetchDesserts = async () => {
    try {
      const typeQuery = selectedTypes.length > 0 ? selectedTypes.join(",") : "";
      const priceQuery = sortOrder ? sortOrder : "";

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/clients`,
        {
          params: {
            type: typeQuery,
            price: priceQuery,
          },
        }
      );

      setDesserts(response.data);
    } catch (error) {
      console.error("Error fetching desserts:", error);
    }
  };

  useEffect(() => {
    fetchDesserts();
  }, [selectedTypes, sortOrder]);

  return (
    <div className=" flex w-full max-w-[1300px] mx-auto gap-10 mt-16 mb-[100px] font-lato">
      <SideBar
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <Cards desserts={desserts} />
    </div>
  );
};

export default Desserts;
