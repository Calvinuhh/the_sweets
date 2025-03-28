import { useEffect, useState } from "react";
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
  flavor: string;
  levels: number;
  portions: number;
  additions?: Array<string>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const promises = dessertCategories.map(({ type }) =>
          fetch(`${import.meta.env.VITE_SERVER_URL}/desserts?type=${type}`, {
            headers,
          }).then(async (response) => {
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
        );

        const results = await Promise.all(promises);

        const newDesserts: DessertCategory = {
          torta: [],
          postre_frio: [],
          galleta: [],
          rollo: [],
        };

        results.forEach((data, index) => {
          const type = dessertCategories[index].type;
          newDesserts[type] = Array.isArray(data) ? data : [];
        });

        setDesserts(newDesserts);
      } catch (error) {
        setError("Error al cargar los postres. Por favor, intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesserts();
  }, []);

  const handleDelete = (id: string) => {
    setDesserts((prev) => ({
      torta: prev.torta.filter((d) => d._id !== id),
      postre_frio: prev.postre_frio.filter((d) => d._id !== id),
      galleta: prev.galleta.filter((d) => d._id !== id),
      rollo: prev.rollo.filter((d) => d._id !== id),
    }));
  };

  const handleUploadImage = (id: string) => {
    setDesserts((prev) => {
      const updatedDesserts = { ...prev };
      Object.keys(updatedDesserts).forEach((type) => {
        updatedDesserts[type] = updatedDesserts[type].map((dessert) =>
          dessert._id === id
            ? { ...dessert, picture: `/images/${id}.jpg` }
            : dessert
        );
      });
      return updatedDesserts;
    });
  };
  const handleEdit = async (dessert: DessertType) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Postre",
      html: `
  <div style="margin-bottom: 15px;">
    <label for="swal-name" style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre:</label>
    <input id="swal-name" class="swal2-input" placeholder="Nombre del postre" value="${
      dessert.name
    }">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="swal-price" style="display: block; margin-bottom: 5px; font-weight: bold;">Precio ($):</label>
    <input id="swal-price" type="number" class="swal2-input" placeholder="Precio en pesos" value="${
      dessert.price
    }">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="swal-portions" style="display: block; margin-bottom: 5px; font-weight: bold;">Número de Porciones:</label>
    <input id="swal-portions" type="number" class="swal2-input" placeholder="Cantidad de porciones" value="${
      dessert.portions
    }" min="1">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="swal-levels" style="display: block; margin-bottom: 5px; font-weight: bold;">Número de Niveles:</label>
    <input id="swal-levels" type="number" class="swal2-input" placeholder="Cantidad de niveles" value="${
      dessert.levels
    }" min="1">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="swal-flavor" style="display: block; margin-bottom: 5px; font-weight: bold;">Sabor:</label>
    <select id="swal-flavor" class="swal2-select" style="width: 260px; border: 1px solid lightgray; border-radius: 5px; padding: 5px;">
      <option value="chocolate" ${
        dessert.flavor === "chocolate" ? "selected" : ""
      }>Chocolate</option>
      <option value="vainilla" ${
        dessert.flavor === "vainilla" ? "selected" : ""
      }>Vainilla</option>
      <option value="caramelo" ${
        dessert.flavor === "caramelo" ? "selected" : ""
      }>Caramelo</option>
    </select>
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="swal-type" style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo de Postre:</label>
    <select id="swal-type" class="swal2-select" style="width: 260px; border: 1px solid lightgray; border-radius: 5px; padding: 5px;">
      ${dessertCategories
        .map(
          (cat) =>
            `<option value="${cat.type}" ${
              cat.type === dessert.type ? "selected" : ""
            }>${cat.label}</option>`
        )
        .join("")}
    </select>
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="swal-active" style="display: block; margin-bottom: 5px; font-weight: bold;">Estado:</label>
    <select id="swal-active" class="swal2-select" style="width:260px; border: 1px solid lightgray; border-radius: 5px; padding: 5px;">
      <option value="true" ${dessert.active ? "selected" : ""}>Activo</option>
      <option value="false" ${
        !dessert.active ? "selected" : ""
      }>Inactivo</option>
    </select>
  </div>
`,
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("swal-name") as HTMLInputElement
        )?.value.trim();
        const price = (
          document.getElementById("swal-price") as HTMLInputElement
        )?.value.trim();
        const portions = Number(
          (document.getElementById("swal-portions") as HTMLInputElement)?.value
        );
        const levels = Number(
          (document.getElementById("swal-levels") as HTMLInputElement)?.value
        );
        const flavor = (
          document.getElementById("swal-flavor") as HTMLSelectElement
        )?.value;
        const type = (document.getElementById("swal-type") as HTMLSelectElement)
          ?.value;
        const active =
          (document.getElementById("swal-active") as HTMLSelectElement)
            ?.value === "true";

        const nameRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;

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

        if (isNaN(portions) || portions < 1) {
          Swal.showValidationMessage(
            "Las porciones deben ser un número mayor o igual a 1."
          );
          return null;
        }

        if (isNaN(levels) || levels < 1) {
          Swal.showValidationMessage(
            "Los niveles deben ser un número mayor o igual a 1."
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
          portions !== dessert.portions ||
          levels !== dessert.levels ||
          type !== dessert.type ||
          active !== dessert.active ||
          flavor !== dessert.flavor;

        if (!hasChanges) {
          Swal.showValidationMessage("No se realizaron cambios.");
          return null;
        }

        return {
          name,
          price: priceNumber,
          portions,
          levels,
          type,
          active,
          flavor,
        };
      },
    });

    if (formValues) {
      try {
        const updatedFields: Partial<DessertType> = {};

        if (formValues.name !== dessert.name)
          updatedFields.name = formValues.name;
        if (formValues.price !== dessert.price)
          updatedFields.price = formValues.price;
        if (formValues.portions !== dessert.portions)
          updatedFields.portions = formValues.portions;
        if (formValues.levels !== dessert.levels)
          updatedFields.levels = formValues.levels;
        if (formValues.type !== dessert.type)
          updatedFields.type = formValues.type;
        if (formValues.active !== dessert.active)
          updatedFields.active = formValues.active;
        if (formValues.flavor !== dessert.flavor)
          updatedFields.flavor = formValues.flavor;

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/desserts/${dessert._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFields),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw Error(errorData);
        }

        const updatedDessert = await response.json();

        setDesserts((prev) => ({
          ...prev,
          [dessert.type]: prev[dessert.type].map((d) =>
            d._id === dessert._id ? updatedDessert : d
          ),
        }));

        Swal.fire("Éxito", "Postre actualizado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleAddDessert = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Postre",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre">
        <input id="swal-price" type="number" class="swal2-input" placeholder="Precio">
        <select id="swal-flavor" class="swal2-select" style="width: 58%; border: 1px solid lightgray; border-radius: 5px; padding: 5px; margin-top: 10px;">
          <option value="" disabled selected>Selecciona un sabor</option>
          <option value="chocolate">Chocolate</option>
          <option value="vainilla">Vainilla</option>
          <option value="caramelo">Caramelo</option>
        </select>
        <select id="swal-type" class="swal2-select" style="width: 58%; border: 1px solid lightgray; border-radius: 5px; padding: 5px; margin-top: 10px;">
          <option value="" disabled selected>Selecciona el tipo de postre</option>
          ${dessertCategories
            .map((cat) => `<option value="${cat.type}">${cat.label}</option>`)
            .join("")}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("swal-name") as HTMLInputElement
        )?.value.trim();
        const price = (
          document.getElementById("swal-price") as HTMLInputElement
        )?.value.trim();
        const flavor = (
          document.getElementById("swal-flavor") as HTMLSelectElement
        )?.value;
        const type = (document.getElementById("swal-type") as HTMLSelectElement)
          ?.value;

        const nameRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;

        if (!name || !price || !type || !flavor) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
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

        return { name, price: priceNumber, type, flavor };
      },
    });

    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/desserts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formValues.name,
              price: formValues.price,
              type: formValues.type,
              flavor: formValues.flavor,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw Error(errorData);
        }

        const newDessert = await response.json();

        setDesserts((prev) => ({
          ...prev,
          [formValues.type]: [...prev[formValues.type], newDessert],
        }));

        Swal.fire("Éxito", "Postre agregado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message, "error");
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

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

      {dessertCategories.map(({ type, label }) => {
        if (desserts[type].length === 0) return null;

        return (
          <div key={type} className="mb-[100px]">
            <h3 className="text-lg font-semibold mb-[50px] text-center">
              {label}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl mx-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border border-gray-300">Nombre</th>
                    <th className="p-3 border border-gray-300">Precio</th>
                    <th className="p-3 border border-gray-300">Imagen</th>
                    <th className="p-3 border border-gray-300">Activo</th>
                    <th className="p-3 border border-gray-300">Adiciones</th>
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
                      onUploadImage={handleUploadImage}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DessertsAdmin;
