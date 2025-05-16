import { ref, computed, watch } from "vue";
import type { Cart, CartItem } from "../interfaces/Cart";

function loadCart(): Cart {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cart");
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }
  }
  return { items: [], total: 0 };
}

const cart = ref<Cart>(loadCart());

function saveCart() {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart.value));
  }
}

function addToCart(item: CartItem) {
  const existing = cart.value.items.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.value.items.push({ ...item });
  }
  updateTotal();
  saveCart();
}

function removeFromCart(productId: string) {
  cart.value.items = cart.value.items.filter((i) => i.productId !== productId);
  updateTotal();
  saveCart();
}

function clearCart() {
  cart.value.items = [];
  cart.value.total = 0;
  saveCart();
}

function updateTotal() {
  cart.value.total = cart.value.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

watch(
  cart,
  () => {
    saveCart();
  },
  { deep: true }
);

const cartItems = computed(() => cart.value.items);
const cartTotal = computed(() => cart.value.total);

export { cart, cartItems, cartTotal, addToCart, removeFromCart, clearCart };
