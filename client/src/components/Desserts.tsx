import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Cards from "./Cards";

interface Dessert {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
  type: string;
  active: boolean;
}

const Desserts = () => {
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDesserts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTypes.length > 0)
        params.append("type", selectedTypes.join(","));
      if (sortOrder) params.append("price", sortOrder);

      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/clients?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDesserts(Array.isArray(data) ? data : []);
    } catch (error) {
      setDesserts([]);
    } finally {
      setIsLoading(false);
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
      <Cards desserts={desserts} isLoading={isLoading} />
    </div>
  );
};

export default Desserts;
