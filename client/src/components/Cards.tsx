import { useNavigate } from "react-router-dom";

interface Dessert {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
  type: string;
}

interface CardsProps {
  desserts: Dessert[];
  isLoading?: boolean;
}

const Cards = ({ desserts, isLoading = false }: CardsProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!Array.isArray(desserts) || desserts.length === 0) {
    return (
      <div className="p-4 text-gray-600 w-full text-center">
        No hay postres disponibles.
      </div>
    );
  }

  const handleViewDetail = (dessertId: string) => {
    navigate(`/desserts/${dessertId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {desserts.map((dessert) => (
        <div
          key={dessert._id}
          className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
        >
          <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
            {dessert.type.replace("_", " ")}
          </div>

          <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            {dessert.picture ? (
              <img
                src={`${import.meta.env.VITE_SERVER_URL}${dessert.picture}`}
                alt={dessert.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <div className="text-gray-400">Sin imagen</div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
              {dessert.name}
            </h3>
            <p className="text-gray-600 mb-3">
              <span className="font-semibold">
                ${dessert.price.toLocaleString()}
              </span>
            </p>

            <button
              onClick={() => handleViewDetail(dessert._id)}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
