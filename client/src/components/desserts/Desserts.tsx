import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { PlusIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
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

  const handleAddDessert = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Postre",
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-price" type="number" class="swal2-input" placeholder="Precio">' +
        '<input id="swal-picture" type="file" class="swal2-file">',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          ?.value;
        const price = (
          document.getElementById("swal-price") as HTMLInputElement
        )?.value;
        const picture = (
          document.getElementById("swal-picture") as HTMLInputElement
        )?.files?.[0];
        return { name, price, picture };
      },
    });

    if (formValues) {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("price", formValues.price);
      if (formValues.picture) {
        formData.append("picture", formValues.picture);
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/desserts",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDesserts((prevDesserts) => [...prevDesserts, response.data]);

        Swal.fire("Éxito", "Postre agregado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo agregar el postre", "error");
      }
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Cargando postres...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-4 font-lato">
      <div className="flex justify-center items-center gap-10 mb-10 mt-10">
        <h2 className="text-xl font-bold">Postres</h2>
        <button
          onClick={handleAddDessert}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 cursor-pointer"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
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
