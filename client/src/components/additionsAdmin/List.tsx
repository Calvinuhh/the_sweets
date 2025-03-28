import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

type ListProps = {
  _id: string;
  name: string;
  price: number;
  onDelete: (_id: string) => void;
  onEdit: (addition: {
    _id: string;
    name: string;
    price: number;
    type: string;
  }) => void;
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const List = ({ _id, name, price, onDelete, onEdit }: ListProps) => {
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const handleView = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/additions/${_id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw Error(error);
      }

      const data = await response.json();

      Swal.fire({
        title: "Detalles de la Adición",
        html: `
          <div style="text-align: center;">
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Precio:</strong> $${data.price}</p>
            <p><strong>Tipo:</strong> ${capitalizeFirstLetter(data.type)}</p>
          </div>
        `,
        confirmButtonText: "Cerrar",
        width: "600px",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/additions/${_id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error);
        }

        Swal.fire("Eliminado", "La adición ha sido eliminada.", "success");
        onDelete(_id);
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/additions/${_id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const data = await response.json();
      onEdit(data);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  return (
    <tr className="border-b border-gray-300 text-center">
      <td className="p-3">{name}</td>
      <td className="p-3">${price}</td>
      <td className="p-3 flex justify-center gap-3">
        <button
          onClick={handleView}
          className="text-blue-500 hover:text-blue-700 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleEdit}
          className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 cursor-pointer"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default List;
