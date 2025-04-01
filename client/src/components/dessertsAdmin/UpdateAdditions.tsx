import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

type AdditionType = {
  _id: string;
  name: string;
  price: number;
};

export default function UpdateAdditions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [postreAdditions, setPostreAdditions] = useState<AdditionType[]>([]);
  const [availableAdditions, setAvailableAdditions] = useState<AdditionType[]>(
    []
  );
  const [dessertName, setDessertName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const dessertResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/desserts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!dessertResponse.ok) {
          const errorData = await dessertResponse.json();
          throw new Error(errorData.message || "Error al cargar el postre");
        }

        const dessertData = await dessertResponse.json();
        setDessertName(dessertData.name); // Guardar el nombre del postre
        setPostreAdditions(dessertData.additions || []);

        const additionsResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/additions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!additionsResponse.ok) {
          const errorData = await additionsResponse.json();
          throw new Error(errorData.message || "Error al cargar las adiciones");
        }

        const additionsData = await additionsResponse.json();

        const filteredAdditions = additionsData.filter(
          (addition: AdditionType) =>
            !dessertData.additions.some(
              (assigned: AdditionType) => assigned._id === addition._id
            )
        );

        setAvailableAdditions(filteredAdditions);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddAddition = (addition: AdditionType) => {
    setPostreAdditions((prev) => [...prev, addition]);
    setAvailableAdditions((prev) =>
      prev.filter((item) => item._id !== addition._id)
    );
  };

  const handleRemoveAddition = (addition: AdditionType) => {
    setAvailableAdditions((prev) => [...prev, addition]);
    setPostreAdditions((prev) =>
      prev.filter((item) => item._id !== addition._id)
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/desserts/${id}/additions`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            additions: postreAdditions.map((addition) => addition._id),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar las adiciones");
      }

      Swal.fire("Éxito", "Adiciones actualizadas correctamente", "success");
      navigate("/admin");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
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
    <div className="min-h-screen bg-gray-50 p-4 font-lato">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mt-[80px]">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Adiciones de {dessertName && `"${dessertName}"`}
          </h2>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Regresar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Adiciones Asignadas
            </h3>
            {postreAdditions.length > 0 ? (
              <ul className="space-y-3">
                {postreAdditions.map((addition) => (
                  <li
                    key={addition._id}
                    className="flex justify-between items-center bg-white p-3 rounded-lg shadow-xs hover:shadow-sm transition-shadow"
                  >
                    <span className="text-gray-700">
                      {addition.name} - ${addition.price}
                    </span>
                    <button
                      onClick={() => handleRemoveAddition(addition)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label="Quitar adición"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 italic py-4">
                No hay adiciones asignadas
              </div>
            )}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Adiciones Disponibles
            </h3>
            {availableAdditions.length > 0 ? (
              <ul className="space-y-3">
                {availableAdditions.map((addition) => (
                  <li
                    key={addition._id}
                    className="flex justify-between items-center bg-white p-3 rounded-lg shadow-xs hover:shadow-sm transition-shadow"
                  >
                    <span className="text-gray-700">
                      {addition.name} - ${addition.price}
                    </span>
                    <button
                      onClick={() => handleAddAddition(addition)}
                      className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50 transition-colors cursor-pointer"
                      aria-label="Agregar adición"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 italic py-4">
                No hay más adiciones disponibles
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
