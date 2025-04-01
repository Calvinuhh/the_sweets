import { useState, useRef, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, cartCount, clearCart, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleModalMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleModalMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClearCart = () => {
    clearCart();
    setIsOpen(false);
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
  };

  return (
    <div className="relative" ref={cartRef}>
      <div
        className="relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 p-4 border border-gray-100"
          onMouseEnter={handleModalMouseEnter}
          onMouseLeave={handleModalMouseLeave}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Tu Carrito</h3>
            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">
              El carrito está vacío
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3 border-b pb-3 group relative"
                >
                  <div className="flex-shrink-0">
                    {item.picture ? (
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}${
                          item.picture
                        }`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm text-black">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.purchaseType === "quantity"
                            ? `$${item.price.toLocaleString()} por unidad`
                            : `$${(item.price / (item.portion ?? 1)).toFixed(
                                0
                              )} por porción`}
                        </p>
                      </div>
                      <span className="font-semibold text-sm text-black">
                        ${item.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {item.purchaseType === "quantity"
                        ? `${item.quantity} ${
                            item.quantity === 1 ? "unidad" : "unidades"
                          }`
                        : `${item.portion} ${
                            item.portion === 1 ? "porción" : "porciones"
                          }`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    className="absolute top-0 right-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="sticky bottom-0 bg-white pt-2 border-t">
                <div className="flex justify-between font-bold text-base mb-3">
                  <span className="text-black">Total:</span>
                  <span className="text-black">
                    $
                    {cart
                      .reduce((sum, item) => sum + item.totalPrice, 0)
                      .toLocaleString()}
                  </span>
                </div>

                <button
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
