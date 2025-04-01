import { Link } from "react-router-dom";

export default function PreMessage() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Proceso de confirmación de pedido
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              Al hacer clic en "Realizar Solicitud de Pedido", no se realizará
              el pago inmediatamente. Primero enviaremos una solicitud a la
              pastelería para que confirmen tu pedido. Una vez confirmado,
              recibirás un correo electrónico con el enlace de pago para
              completar tu compra.
            </p>
          </div>
          <div className="mt-4">
            <Link
              to="/contact"
              className="text-sm font-medium text-blue-700 hover:text-blue-600"
            >
              ¿Tienes dudas? Contáctanos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
