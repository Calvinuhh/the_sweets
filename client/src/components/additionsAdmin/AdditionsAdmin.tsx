import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import List from "./List";

type AdditionType = {
  _id: string;
  name: string;
  price: number;
  type: string;
};

type AdditionCategory = {
  [key: string]: AdditionType[];
};

const additionCategories = [
  { type: "cobertura", label: "Coberturas" },
  { type: "relleno", label: "Rellenos" },
  { type: "topping", label: "Toppings" },
  { type: "decoracion", label: "Decoraciones" },
];

const AdditionsAdmin = () => {
  const [additions, setAdditions] = useState<AdditionCategory>({
    cobertura: [],
    relleno: [],
    topping: [],
    decoracion: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdditions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const promises = additionCategories.map(({ type }) =>
          fetch(`${import.meta.env.VITE_SERVER_URL}/additions?type=${type}`, {
            headers,
          }).then(async (response) => {
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
        );

        const results = await Promise.all(promises);

        const newAdditions: AdditionCategory = {
          cobertura: [],
          relleno: [],
          topping: [],
          decoracion: [],
        };

        results.forEach((data, index) => {
          const type = additionCategories[index].type;
          newAdditions[type] = Array.isArray(data) ? data : [];
        });

        setAdditions(newAdditions);
      } catch (error) {
        setError(
          "Error al cargar las adiciones. Por favor, intenta nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdditions();
  }, []);

  const handleDelete = (id: string) => {
    setAdditions((prev) => ({
      cobertura: prev.cobertura.filter((a) => a._id !== id),
      relleno: prev.relleno.filter((a) => a._id !== id),
      topping: prev.topping.filter((a) => a._id !== id),
      decoracion: prev.decoracion.filter((a) => a._id !== id),
    }));
  };

  const handleEdit = async (addition: AdditionType) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Adición",
      html: `
        <div style="margin-bottom: 15px;">
          <label for="swal-name" style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre:</label>
          <input id="swal-name" class="swal2-input" placeholder="Nombre de la adición" value="${
            addition.name
          }">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label for="swal-price" style="display: block; margin-bottom: 5px; font-weight: bold;">Precio ($):</label>
          <input id="swal-price" type="number" class="swal2-input" placeholder="Precio en pesos" value="${
            addition.price
          }">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label for="swal-type" style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo de Adición:</label>
          <select id="swal-type" class="swal2-select" style="width: 260px; border: 1px solid lightgray; border-radius: 5px; padding: 5px;">
            ${additionCategories
              .map(
                (cat) =>
                  `<option value="${cat.type}" ${
                    cat.type === addition.type ? "selected" : ""
                  }>${cat.label}</option>`
              )
              .join("")}
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
        const type = (document.getElementById("swal-type") as HTMLSelectElement)
          ?.value;

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

        const existingAddition = Object.values(additions)
          .flat()
          .find((a) => a.name === name && a._id !== addition._id);

        if (existingAddition) {
          Swal.showValidationMessage("Ya existe una adición con ese nombre.");
          return null;
        }

        const hasChanges =
          name !== addition.name ||
          priceNumber !== addition.price ||
          type !== addition.type;

        if (!hasChanges) {
          Swal.showValidationMessage("No se realizaron cambios.");
          return null;
        }

        return {
          name,
          price: priceNumber,
          type,
        };
      },
    });

    if (formValues) {
      try {
        const updatedFields: Partial<AdditionType> = {};

        if (formValues.name !== addition.name)
          updatedFields.name = formValues.name;
        if (formValues.price !== addition.price)
          updatedFields.price = formValues.price;
        if (formValues.type !== addition.type)
          updatedFields.type = formValues.type;

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/additions/${addition._id}`,
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

        const updatedAddition = await response.json();

        setAdditions((prev) => {
          const newAdditions = { ...prev };
          newAdditions[addition.type] = newAdditions[addition.type].filter(
            (a) => a._id !== addition._id
          );
          newAdditions[updatedAddition.type] = [
            ...newAdditions[updatedAddition.type].filter(
              (a) => a._id !== updatedAddition._id
            ),
            updatedAddition,
          ];
          return newAdditions;
        });

        Swal.fire("Éxito", "Adición actualizada correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleAddAddition = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Adición",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre">
        <input id="swal-price" type="number" class="swal2-input" placeholder="Precio">
        <select id="swal-type" class="swal2-select" style="width: 58%; border: 1px solid lightgray; border-radius: 5px; padding: 5px; margin-top: 10px;">
          <option value="" disabled selected>Selecciona el tipo de adición</option>
          ${additionCategories
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
        const type = (document.getElementById("swal-type") as HTMLSelectElement)
          ?.value;

        const nameRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;

        if (!name || !price || !type) {
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

        const existingAddition = Object.values(additions)
          .flat()
          .find((addition) => addition.name === name);

        if (existingAddition) {
          Swal.showValidationMessage("Ya existe una adición con ese nombre.");
          return false;
        }

        return { name, price: priceNumber, type };
      },
    });

    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/additions`,
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
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw Error(errorData);
        }

        const newAddition = await response.json();

        setAdditions((prev) => ({
          ...prev,
          [formValues.type]: [...prev[formValues.type], newAddition],
        }));

        Swal.fire("Éxito", "Adición agregada correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message, "error");
      }
    }
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
        <h2 className="text-[30px] font-bold">Administración de Adiciones</h2>
        <button
          onClick={handleAddAddition}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 cursor-pointer"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>

      {additionCategories.map(({ type, label }) => {
        if (additions[type].length === 0) return null;

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
                    <th className="p-3 border border-gray-300">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {additions[type].map((addition) => (
                    <List
                      key={addition._id}
                      _id={addition._id}
                      name={addition.name}
                      price={addition.price}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
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

export default AdditionsAdmin;
