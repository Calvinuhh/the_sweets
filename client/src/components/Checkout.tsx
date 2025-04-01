import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import PreMessage from "./PreMessage";
import CheckoutForm from "./CheckoutForm";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo puede contener letras y espacios";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido";
      isValid = false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone) {
      newErrors.phone = "El teléfono es obligatorio";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Por favor ingresa un teléfono válido (10 dígitos)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendOrderRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/email/send-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            items: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              portion: item.portion,
              purchaseType: item.purchaseType,
              additions: item.additions,
              totalPrice: item.totalPrice,
            })),
            total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al enviar la solicitud de pedido"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending order request:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizePurchase = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar pedido?",
      html: `
        <div class="text-left">
          <p>Vas a solicitar ${cart.reduce(
            (sum, item) => sum + item.quantity,
            0
          )} productos</p>
          <p class="mt-2"><strong>Total: $${cart
            .reduce((sum, item) => sum + item.totalPrice, 0)
            .toLocaleString()}</strong></p>
          <p class="mt-4">Los datos que enviarás son:</p>
          <ul class="mt-2 text-sm">
            <li>Nombre: ${formData.name}</li>
            <li>Email: ${formData.email}</li>
            <li>Teléfono: ${formData.phone}</li>
          </ul>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await sendOrderRequest();

        await Swal.fire({
          title: "¡Solicitud enviada!",
          text: "Hemos recibido tu pedido. Te enviaremos un correo con los detalles de pago una vez confirmado.",
          icon: "success",
        });

        clearCart();
        navigate("/");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto mt-16 mb-[100px] font-lato p-4">
      <BackButton onClick={() => navigate(-1)} />

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Finalizar Compra
      </h1>

      <PreMessage />

      <div className="bg-white rounded-xl shadow-lg p-6">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay productos en tu carrito</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista de productos */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {item.picture ? (
                        <img
                          src={`${import.meta.env.VITE_SERVER_URL}${
                            item.picture
                          }`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">
                          {item.name}
                        </h3>
                        <span className="font-semibold text-gray-700">
                          ${item.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {item.purchaseType === "quantity"
                          ? `${item.quantity} ${
                              item.quantity === 1 ? "unidad" : "unidades"
                            }`
                          : `${item.portion} ${
                              item.portion === 1 ? "porción" : "porciones"
                            }`}
                      </div>

                      {item.additions && item.additions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            Adiciones:
                          </p>
                          <ul className="mt-1 space-y-1">
                            {item.additions.map((addition) => (
                              <li
                                key={addition.id}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-600">
                                  + {addition.name}
                                </span>
                                <span className="text-gray-700">
                                  + ${addition.price.toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-3">
                Resumen del pedido
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">
                    $
                    {cart
                      .reduce((sum, item) => {
                        const basePrice =
                          item.price *
                          (item.purchaseType === "quantity"
                            ? item.quantity
                            : 1);
                        return sum + basePrice;
                      }, 0)
                      .toLocaleString()}
                  </span>
                </div>

                {cart.some(
                  (item) => item.additions && item.additions.length > 0
                ) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adiciones:</span>
                    <span className="text-gray-800">
                      $
                      {cart
                        .reduce((sum, item) => {
                          const additionsPrice =
                            item.additions?.reduce(
                              (aSum, addition) =>
                                aSum +
                                addition.price *
                                  (item.purchaseType === "quantity"
                                    ? item.quantity
                                    : 1),
                              0
                            ) || 0;
                          return sum + additionsPrice;
                        }, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>
                      $
                      {cart
                        .reduce((sum, item) => sum + item.totalPrice, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {showForm ? (
              <>
                <CheckoutForm
                  formData={formData}
                  onChange={handleFormChange}
                  errors={errors}
                />
                <button
                  onClick={handleFinalizePurchase}
                  className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Realizar Solicitud de Pedido"
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full cursor-pointer py-3 px-6 rounded-lg text-white font-medium transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg mt-6"
              >
                Ingresar datos para el pedido
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
