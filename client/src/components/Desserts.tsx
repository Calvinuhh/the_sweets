import { useEffect, useState } from "react";
import axios from "axios";

interface Dessert {
  id: number;
  name: string;
  price: number;
  picture: string;
}

const DessertGrid = () => {
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const response = await axios.get<Dessert[]>(
          "http://localhost:3000/desserts"
        );
        setDesserts(response.data);
      } catch (err) {
        setError("Error al cargar los postres");
      } finally {
        setLoading(false);
      }
    };

    fetchDesserts();
  }, []);

  console.log(desserts);

  if (loading) return <p>Cargando postres...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Lista de Postres</h2>
      {desserts.length === 0 ? (
        <p>No hay postres disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {desserts.map((dessert) => (
            <div key={dessert.id} className="border rounded-lg p-3 shadow-lg">
              <img
                src={`http://localhost:3000${dessert.picture}`}
                alt={dessert.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-2">{dessert.name}</h3>
              <p className="text-gray-600">${dessert.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DessertGrid;
