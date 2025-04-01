import { createContext, useContext, useEffect, useState } from "react";

interface CartItemAddition {
  id: string;
  name: string;
  price: number;
}

interface CartItemBase {
  id: string;
  cartItemId: string;
  name: string;
  price: number;
  quantity: number;
  portion: number | null;
  purchaseType: "quantity" | "portions";
  totalPrice: number;
  picture: string | null;
  additions?: CartItemAddition[];
}

interface CartItem extends CartItemBase {
  cartItemId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItemBase) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartCount: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItemBase) => {
    setCart((prevCart) => {
      const cartItemId = `${item.id}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      return [...prevCart, { ...item, cartItemId }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
