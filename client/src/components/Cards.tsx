interface Dessert {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
  type: string;
  active: boolean;
}

interface CardsProps {
  desserts: Dessert[];
  isLoading?: boolean;
}

const Cards = ({ desserts, isLoading = false }: CardsProps) => {
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

  return (
    <div className="flex flex-wrap gap-6 p-4">
      {desserts.map((dessert) => (
        <div
          key={dessert._id}
          className="w-[220px] rounded-lg p-4 text-center border bg-gradient-to-br from-blue-50 to-white shadow-lg transition-transform hover:scale-105"
        >
          {dessert.picture && (
            <img
              src={`${import.meta.env.VITE_SERVER_URL}${dessert.picture}`}
              alt={dessert.name}
              className="w-full rounded-md mb-3"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {dessert.name}
          </h3>
          <p className="text-gray-600 font-medium">Precio: ${dessert.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
