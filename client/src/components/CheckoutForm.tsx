import { ChangeEvent } from "react";

interface CheckoutFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export default function CheckoutForm({
  formData,
  onChange,
  errors,
}: CheckoutFormProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h3 className="font-bold text-lg text-gray-800 mb-4">
        Tus datos de contacto
      </h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            required
            placeholder="Ingresa tu nombre completo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
            placeholder="ejemplo@correo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            required
            placeholder="Ingresa tu número de teléfono"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          * Campos obligatorios. Usaremos esta información para contactarte
          sobre tu pedido.
        </p>
      </div>
    </div>
  );
}
