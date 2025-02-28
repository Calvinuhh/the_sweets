import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import axios from "axios";

const List = ({
  _id,
  name,
  price,
  picture,
  onDelete,
}: {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
  onDelete: (_id: string) => void;
}) => {
  const handleView = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/desserts/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        title: "Detalles del Postre",
        html: `
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Precio:</strong> $${data.price}</p>
          <br/>
          ${
            data.picture
              ? `<img src="${import.meta.env.VITE_SERVER_URL}${
                  data.picture
                }" style="max-width: 100%; height: auto; border-radius: 8px;"/>`
              : "<p>No hay imagen disponible</p>"
          }
        `,
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la información del postre.",
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
        await axios.delete(`http://localhost:3000/desserts/${_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        Swal.fire("Eliminado", "El postre ha sido eliminado.", "success");
        onDelete(_id);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el postre.",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    }
  };

  return (
    <tr className="border-b border-gray-300 text-center">
      <td className="p-3">{name}</td>
      <td className="p-3">${price}</td>
      <td className="p-3">{picture ? "Sí" : "No"}</td>
      <td className="p-3 flex justify-center gap-3">
        <button
          onClick={handleView}
          className="text-blue-500 hover:text-blue-700 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <button className="text-yellow-500 hover:text-yellow-700">
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
