import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

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
    flavor: string;
    levels: number;
    portions: number;
  }) => void;
  onDeleteImage: (id: string, type: string) => void;
  onUploadImage: (id: string) => void;
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const handleView = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/desserts/${_id}`,
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
        title: "Detalles del Postre",
        html: `
          <div style="text-align: center;">
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Precio:</strong> $${data.price}</p>
            <p><strong>Tipo:</strong> ${data.type}</p>
            <p><strong>Sabor:</strong> ${capitalizeFirstLetter(data.flavor)}</p>
            <p><strong>Niveles:</strong> ${data.levels} nivel${
          data.levels !== 1 ? "es" : ""
        }</p>
            <p><strong>Porciones:</strong> ${data.portions} porción${
          data.portions !== 1 ? "es" : ""
        }</p>
            <p><strong>Estado:</strong> ${
              data.active ? "Activo" : "Inactivo"
            }</p>
          </div>
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
          `${import.meta.env.VITE_SERVER_URL}/desserts/${_id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error);
        }

        Swal.fire("Eliminado", "El postre ha sido eliminado.", "success");
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
        `${import.meta.env.VITE_SERVER_URL}/desserts/${_id}`,
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
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/desserts/picture/${_id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error);
        }

        const data = await response.json();
        Swal.fire(
          "Éxito",
          "La imagen del postre ha sido eliminada.",
          "success"
        );
        onDeleteImage(_id, data.type);
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
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/desserts/picture/${_id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error);
        }

        Swal.fire("Éxito", "Imagen subida correctamente", "success");
        onUploadImage(_id);
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
