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
  type: string;
  active: boolean;
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

  const handleEdit = async (dessert: DessertType) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Postre",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${
          dessert.name
        }">
        <input id="swal-price" type="number" class="swal2-input" placeholder="Precio" value="${
          dessert.price
        }">
        <select id="swal-type" class="swal2-select">
          ${dessertCategories
            .map(
              (cat) =>
                `<option value="${cat.type}" ${
                  cat.type === dessert.type ? "selected" : ""
                }>${cat.label}</option>`
            )
            .join("")}
        </select>
        <div style="display: flex; flex-direction: column; width: 60%; align-items: center; margin: 0 auto; margin-top: 10px;">
          <label for="swal-active" style="border: 1px solid #ccc; padding: 5px; border-radius: 4px; align-self: flex-start;">Activo:</label>
          <select id="swal-active" class="swal2-select">
            <option value="true" ${dessert.active ? "selected" : ""}>Sí</option>
            <option value="false" ${
              !dessert.active ? "selected" : ""
            }>No</option>
          </select>
        </div>
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
        const active =
          (document.getElementById("swal-active") as HTMLSelectElement)
            ?.value === "true";
        const picture = (
          document.getElementById("swal-picture") as HTMLInputElement
        )?.files?.[0];

        const nameRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;

        if (!name || !price || !type) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios, excepto la imagen."
          );
          return null;
        }

        if (!nameRegex.test(name)) {
          Swal.showValidationMessage(
            "El nombre solo puede contener letras, números y espacios."
          );
          return null;
        }

        const priceNumber = Number(price);
        if (isNaN(priceNumber) || priceNumber <= 999) {
          Swal.showValidationMessage(
            "El precio debe ser un número mayor o igual a 1000."
          );
          return null;
        }

        const existingDessert = Object.values(desserts)
          .flat()
          .find((d) => d.name === name && d._id !== dessert._id);

        if (existingDessert) {
          Swal.showValidationMessage("Ya existe un postre con ese nombre.");
          return null;
        }

        const hasChanges =
          name !== dessert.name ||
          priceNumber !== dessert.price ||
          type !== dessert.type ||
          active !== dessert.active ||
          picture !== undefined;

        if (!hasChanges) {
          Swal.showValidationMessage("No se realizaron cambios.");
          return null;
        }

        return { name, price: priceNumber, type, active, picture };
      },
    });

    if (formValues) {
      const updateObject: Partial<DessertType> = {};

      if (formValues.name !== dessert.name) {
        updateObject.name = formValues.name;
      }
      if (formValues.price !== dessert.price) {
        updateObject.price = formValues.price;
      }
      if (formValues.type !== dessert.type) {
        updateObject.type = formValues.type;
      }
      if (formValues.active !== dessert.active) {
        updateObject.active = formValues.active;
      }
      if (formValues.picture) {
        updateObject.picture = `/images/${formValues.picture.name}`;
      }

      const formData = new FormData();
      if (updateObject.name) formData.append("name", updateObject.name);
      if (updateObject.price)
        formData.append("price", updateObject.price.toString());
      if (updateObject.type) formData.append("type", updateObject.type);
      if (updateObject.active !== undefined)
        formData.append("active", updateObject.active.toString());
      if (formValues.picture) {
        formData.append("picture", formValues.picture);
      }

      try {
        const response = await axios.patch(
          `http://localhost:3000/desserts/${dessert._id}`,
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
          [dessert.type]: prev[dessert.type].map((d) =>
            d._id === dessert._id ? response.data : d
          ),
        }));

        Swal.fire("Éxito", "Postre actualizado correctamente", "success");
      } catch (error: any) {
        let errorMessage = "Ocurrió un error al actualizar el postre.";

        if (error.response) {
          errorMessage = error.response.data.message || error.response.data;
        } else if (error.request) {
          errorMessage = "No se recibió respuesta del servidor.";
        } else {
          errorMessage = error.message;
        }

        Swal.fire("Error", errorMessage, "error");
      }
    }
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

        const nameRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;

        if (!name || !price || !type) {
          Swal.showValidationMessage(
            "Todos los campos son obligatorios, excepto la imagen."
          );
          return false;
        }

        if (!nameRegex.test(name)) {
          Swal.showValidationMessage(
            "El nombre solo puede contener letras, números y espacios."
          );
          return false;
        }

        const priceNumber = Number(price);
        if (isNaN(priceNumber)) {
          Swal.showValidationMessage("El precio debe ser un número.");
          return false;
        }
        if (priceNumber <= 999) {
          Swal.showValidationMessage(
            "El precio debe ser un número mayor o igual a 1000."
          );
          return false;
        }

        const existingDessert = Object.values(desserts)
          .flat()
          .find((dessert) => dessert.name === name);

        if (existingDessert) {
          Swal.showValidationMessage("Ya existe un postre con ese nombre.");
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
        let errorMessage = "Ocurrió un error al agregar el postre.";

        if (error.response) {
          errorMessage = error.response.data.message || error.response.data;
        } else if (error.request) {
          errorMessage = "No se recibió respuesta del servidor.";
        } else {
          errorMessage = error.message;
        }

        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  const handleDeleteImage = (id: string, type: string) => {
    setDesserts((prev) => ({
      ...prev,
      [type]: prev[type].map((dessert) =>
        dessert._id === id ? { ...dessert, picture: null } : dessert
      ),
    }));
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
                    <th className="p-3 border border-gray-300">Activo</th>
                    <th className="p-3 border border-gray-300">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {desserts[type].map((dessert) => (
                    <List
                      key={dessert._id}
                      _id={dessert._id}
                      name={dessert.name}
                      price={dessert.price}
                      picture={dessert.picture}
                      active={dessert.active}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onDeleteImage={handleDeleteImage}
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
