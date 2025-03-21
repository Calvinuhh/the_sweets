import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import axios from "axios";

type ListProps = {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
  active: boolean;
  onDelete: (_id: string) => void;
  onEdit: (dessert: {
    _id: string;
    name: string;
    price: number;
    picture: string | null;
    type: string;
    active: boolean;
  }) => void;
  onDeleteImage: (id: string, type: string) => void;
  onUploadImage: (id: string) => void;
};

const List = ({
  _id,
  name,
  price,
  picture,
  active,
  onDelete,
  onEdit,
  onDeleteImage,
  onUploadImage,
}: ListProps) => {
  const handleView = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/desserts/${_id}`,
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
          <p><strong>Tipo:</strong> ${data.type}</p>
          <p><strong>Activo:</strong> ${data.active ? "Sí" : "No"}</p>
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
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data ||
          error.message ||
          "No se pudo obtener la información del postre.",
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
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/desserts/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Swal.fire("Eliminado", "El postre ha sido eliminado.", "success");
        onDelete(_id);
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text:
            error.response?.data ||
            error.message ||
            "No se pudo eliminar el postre.",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/desserts/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onEdit(data);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data ||
          error.message ||
          "No se pudo obtener la información del postre para editar.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la imagen del postre.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/desserts/picture/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Swal.fire(
          "Éxito",
          "La imagen del postre ha sido eliminada.",
          "success"
        );

        onDeleteImage(_id, data.type);
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text:
            error.response?.data ||
            error.message ||
            "No se pudo eliminar la imagen del postre.",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    }
  };

  const handleUploadImage = async () => {
    const { value: file } = await Swal.fire({
      title: "Subir imagen",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Subir imagen",
      },
      showCancelButton: true,
      confirmButtonText: "Subir",
      cancelButtonText: "Cancelar",
    });

    if (file) {
      const formData = new FormData();
      formData.append("picture", file);

      try {
        await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/desserts/picture/${_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Swal.fire("Éxito", "Imagen subida correctamente", "success");
        onUploadImage(_id);
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text:
            error.response?.data || error.message || "Error al subir imagen",
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
      <td className="p-3">{active ? "Sí" : "No"}</td>
      <td className="p-3 flex justify-center gap-3">
        <button
          onClick={handleView}
          className="text-blue-500 hover:text-blue-700 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleUploadImage}
          disabled={!!picture}
          className={`${
            picture
              ? "text-gray-400 opacity-50 cursor-not-allowed"
              : "text-green-500 hover:text-green-700 cursor-pointer"
          }`}
        >
          <PhotoIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleEdit}
          className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleDeleteImage}
          disabled={!picture}
          className={`${
            !picture
              ? "text-gray-400 opacity-50 cursor-not-allowed"
              : "text-red-500 hover:text-red-700 cursor-pointer"
          }`}
        >
          <PhotoIcon className="w-5 h-5" />
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
