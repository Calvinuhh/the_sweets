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
}

const Cards = ({ desserts }: CardsProps) => {
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
