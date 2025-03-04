import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { PlusIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import List from "./List";

type DessertType = {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
};

type DessertCategory = {
  [key: string]: DessertType[];
};

const dessertCategories = [
  { type: "torta", label: "Tortas" },
  { type: "postre_frio", label: "Postres Fríos" },
  { type: "galleta", label: "Galletas" },
  { type: "rollo", label: "Rollos" },
];

const DessertsAdmin = () => {
  const [desserts, setDesserts] = useState<DessertCategory>({
    torta: [],
    postre_frio: [],
    galleta: [],
    rollo: [],
  });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    torta: true,
    postre_frio: true,
    galleta: true,
    rollo: true,
  });
  const [error, setError] = useState<{ [key: string]: string | null }>({
    torta: null,
    postre_frio: null,
    galleta: null,
    rollo: null,
  });

  useEffect(() => {
    dessertCategories.forEach(({ type }) => {
      setLoading((prev) => ({ ...prev, [type]: true }));
      axios
        .get(`http://localhost:3000/desserts?type=${type}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setDesserts((prev) => ({
            ...prev,
            [type]: res.data,
          }));
          setError((prev) => ({ ...prev, [type]: null }));
        })
        .catch((err: AxiosError | any) => {
          setError((prev) => ({
            ...prev,
            [type]: err.response?.data,
          }));
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, [type]: false }));
        });
    });
  }, []);

  const handleDelete = (id: string) => {
    setDesserts((prev) => ({
      torta: prev.torta.filter((d) => d._id !== id),
      postre_frio: prev.postre_frio.filter((d) => d._id !== id),
      galleta: prev.galleta.filter((d) => d._id !== id),
      rollo: prev.rollo.filter((d) => d._id !== id),
    }));
  };

  const handleAddDessert = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Postre",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre">
        <input id="swal-price" type="number" class="swal2-input" placeholder="Precio">
        <select id="swal-type" class="swal2-select">
          <option value="" disabled selected>Selecciona el tipo de postre</option>
          ${dessertCategories
            .map((cat) => `<option value="${cat.type}">${cat.label}</option>`)
            .join("")}
        </select>
        <input id="swal-picture" type="file" class="swal2-file">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("swal-name") as HTMLInputElement
        )?.value.trim();
        const price = (
          document.getElementById("swal-price") as HTMLInputElement
        )?.value.trim();
        const type = (document.getElementById("swal-type") as HTMLSelectElement)
          ?.value;
        const picture = (
          document.getElementById("swal-picture") as HTMLInputElement
        )?.files?.[0];

        if (!name || !price || !type) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios, excepto la imagen."
          );
          return false;
        }

        const priceNumber = Number(price);
        if (isNaN(priceNumber) || priceNumber <= 1000) {
          Swal.showValidationMessage(
            "El precio debe ser un número mayor a 1000."
          );
          return false;
        }

        return { name, price: priceNumber, type, picture };
      },
    });

    if (formValues) {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("price", formValues.price.toString());
      formData.append("type", formValues.type);
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

        setDesserts((prev) => ({
          ...prev,
          [formValues.type]: [...prev[formValues.type], response.data],
        }));

        Swal.fire("Éxito", "Postre agregado correctamente", "success");
      } catch (error: any) {
        const errorMessage = error.response?.data;
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  return (
    <div className="p-4 font-lato">
      <div className="flex justify-center items-center gap-10 mb-[100px] mt-10">
        <h2 className="text-[30px] font-bold">Administración de Postres</h2>
        <button
          onClick={handleAddDessert}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 cursor-pointer"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>

      {dessertCategories.map(({ type, label }) => (
        <div key={type} className="mb-[100px]">
          <h3 className="text-lg font-semibold mb-[50px] text-center">
            {label}
          </h3>

          {loading[type] ? (
            <p className="text-center text-gray-500">
              Cargando {label.toLowerCase()}...
            </p>
          ) : error[type] ? (
            <p className="text-center text-red-500">{error[type]}</p>
          ) : desserts[type].length > 0 ? (
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
                  {desserts[type].map((dessert) => (
                    <List
                      key={dessert._id}
                      {...dessert}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No hay {label.toLowerCase()} disponibles.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DessertsAdmin;
