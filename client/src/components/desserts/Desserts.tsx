import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import List from "./List";

const Desserts = () => {
  const [desserts, setDesserts] = useState<
    { _id: string; name: string; price: number; picture: string | null }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/desserts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setDesserts(res.data);
        setLoading(false);
      })
      .catch((err: AxiosError | any) => {
        setError(err.response?.data || "Error al obtener los postres");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    setDesserts((prevDesserts) =>
      prevDesserts.filter((dessert) => dessert._id !== id)
    );
  };

  if (loading)
    return <p className="text-center text-gray-500">Cargando postres...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-4 font-lato">
      <h2 className="text-xl font-bold text-center mb-10 mt-10">Postres</h2>
      <div className="overflow-x-auto">
        <table className="w-full max-w-3xl mx-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border border-gray-300">Nombre</th>
              <th className="p-3 border border-gray-300">Precio</th>
              <th className="p-3 border border-gray-300">Imagen</th>
              <th className="p-3 border border-gray-300">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {desserts.map((dessert) => (
              <List key={dessert._id} {...dessert} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Desserts;
