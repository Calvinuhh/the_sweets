import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { useCart } from "../components/CartContext";
import Swal from "sweetalert2";

interface Dessert {
  _id: string;
  name: string;
  price: number;
  picture: string | null;
  type: string;
  flavor: string;
  levels: number;
  portions: number;
  availablePortions?: number[];
  additions?: string[];
}

interface Addition {
  _id: string;
  name: string;
  price: number;
}

type PurchaseType = "quantity" | "portions";

export default function DessertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dessert, setDessert] = useState<Dessert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("quantity");
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<number | null>(null);
  const [availableAdditions, setAvailableAdditions] = useState<Addition[]>([]);
  const [selectedAdditions, setSelectedAdditions] = useState<Addition[]>([]);
  const [loadingAdditions, setLoadingAdditions] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDessert = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/clients/${id}`
        );

        if (!response.ok) {
          throw new Error("Postre no encontrado");
        }

        const data = await response.json();
        const availablePortions = Array.from(
          { length: data.portions },
          (_, i) => i + 1
        );

        setDessert({ ...data, availablePortions });
        setSelectedPortion(availablePortions[0]);

        // Cargar adiciones si existen
        if (data.additions && data.additions.length > 0) {
          fetchAdditions(data.additions);
        }
      } catch (error) {
        console.error("Error fetching dessert:", error);
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAdditions = async (additionIds: string[]) => {
      setLoadingAdditions(true);
      try {
        const additionsPromises = additionIds.map((id) =>
          fetch(`${import.meta.env.VITE_SERVER_URL}/additions/${id}`)
            .then((res) => res.json())
            .catch(() => null)
        );

        const additionsResults = await Promise.all(additionsPromises);
        const validAdditions = additionsResults.filter((a) => a !== null);

        setAvailableAdditions(validAdditions);
      } catch (error) {
        console.error("Error fetching additions:", error);
      } finally {
        setLoadingAdditions(false);
      }
    };

    fetchDessert();
  }, [id, navigate]);

  const calculateTotalPrice = () => {
    if (!dessert) return 0;

    let basePrice = 0;
    if (purchaseType === "quantity") {
      basePrice = dessert.price * quantity;
    } else {
      if (!selectedPortion) return 0;
      const portionRatio = selectedPortion / dessert.portions;
      basePrice = dessert.price * portionRatio;
    }

    // Sumar el precio de las adiciones seleccionadas
    const additionsPrice = selectedAdditions.reduce(
      (sum, addition) =>
        sum + addition.price * (purchaseType === "quantity" ? quantity : 1),
      0
    );

    return basePrice + additionsPrice;
  };

  const handleAddToCart = () => {
    if (!dessert) return;

    const itemToAdd = {
      id: dessert._id,
      cartItemId: `${dessert._id}-${purchaseType}-${Date.now()}`,
      name: dessert.name,
      price:
        purchaseType === "quantity" ? dessert.price : calculateTotalPrice(),
      quantity: purchaseType === "quantity" ? quantity : 1,
      portion: purchaseType === "portions" ? selectedPortion : null,
      purchaseType,
      totalPrice: calculateTotalPrice(),
      picture: dessert.picture,
      additions:
        selectedAdditions.length > 0
          ? selectedAdditions.map((a) => ({
              id: a._id,
              name: a.name,
              price: a.price,
            }))
          : undefined,
    };

    addToCart(itemToAdd);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "¡Agregado al carrito!",
      text:
        purchaseType === "quantity"
          ? `${quantity} ${quantity === 1 ? "unidad" : "unidades"} de ${
              dessert.name
            }`
          : `${selectedPortion} ${
              selectedPortion === 1 ? "porción" : "porciones"
            } de ${dessert.name}`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
    });
  };

  const toggleAddition = (addition: Addition) => {
    setSelectedAdditions((prev) => {
      const isSelected = prev.some((a) => a._id === addition._id);
      if (isSelected) {
        return prev.filter((a) => a._id !== addition._id);
      } else {
        return [...prev, addition];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dessert) {
    return (
      <div className="p-4 text-gray-600 w-full text-center">
        Postre no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto mt-16 mb-[100px] font-lato p-4">
      <BackButton onClick={() => navigate(-1)} />

      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg p-6">
        <div className="md:w-1/2 flex items-center justify-center">
          {dessert.picture ? (
            <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gray-50">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}${dessert.picture}`}
                alt={dessert.name}
                className="w-full h-full object-contain object-center"
                style={{ filter: "brightness(1.05) contrast(1.05)" }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gray-200 rounded-lg"></div>
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 text-lg">
              Imagen no disponible
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{dessert.name}</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {dessert.type.replace("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Sabor</p>
              <p className="font-medium">{dessert.flavor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Niveles</p>
              <p className="font-medium">{dessert.levels}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Porciones totales</p>
              <p className="font-medium">{dessert.portions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Precio total</p>
              <p className="text-2xl font-bold text-gray-700">
                ${dessert.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de compra
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={purchaseType === "quantity"}
                  onChange={() => setPurchaseType("quantity")}
                />
                <span className="ml-2">Comprar por cantidad</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={purchaseType === "portions"}
                  onChange={() => setPurchaseType("portions")}
                />
                <span className="ml-2">Comprar por porciones</span>
              </label>
            </div>
          </div>

          {purchaseType === "portions" && (
            <div className="mb-4">
              <label
                htmlFor="portion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Porciones a comprar
              </label>
              <select
                id="portion"
                value={selectedPortion || ""}
                onChange={(e) => setSelectedPortion(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {dessert.availablePortions?.map((portion) => (
                  <option key={portion} value={portion}>
                    {portion} {portion === 1 ? "porción" : "porciones"} ($
                    {(
                      (dessert.price * portion) /
                      dessert.portions
                    ).toLocaleString()}
                    )
                  </option>
                ))}
              </select>
            </div>
          )}

          {purchaseType === "quantity" && (
            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cantidad
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "unidad" : "unidades"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loadingAdditions ? (
            <div className="mb-6 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : availableAdditions.length > 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adiciones (opcionales)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableAdditions.map((addition) => (
                  <div
                    key={addition._id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAdditions.some((a) => a._id === addition._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleAddition(addition)}
                  >
                    <div className="flex-grow">
                      <p className="font-medium">{addition.name}</p>
                      <p className="text-sm text-gray-600">
                        +${addition.price.toLocaleString()}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedAdditions.some(
                        (a) => a._id === addition._id
                      )}
                      onChange={() => toggleAddition(addition)}
                      className="h-4 w-4 text-blue-600 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <button
            onClick={handleAddToCart}
            className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          >
            Agregar al carrito - Total: $
            {calculateTotalPrice().toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
