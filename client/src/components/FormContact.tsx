import { useState } from "react";

export default function FormContact() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateName = (name: string) => {
    if (!name) return "El nombre es obligatorio";
    if (!/^[a-zA-Z0-9\s]+$/.test(name))
      return "El nombre solo puede contener letras, números y espacios";
    if (name.length > 100) return "El nombre debe ser menor que 100 caracteres";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "El email es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "El email no es válido";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "El teléfono es obligatorio";
    if (!/^\d{10}$/.test(phone))
      return "El teléfono debe contener 10 dígitos numéricos";
    return "";
  };

  const validateSubject = (subject: string) => {
    if (!subject) return "El asunto es obligatorio";
    if (subject.length > 300)
      return "El asunto debe ser menor que 300 caracteres";
    return "";
  };

  const validateMessage = (message: string) => {
    if (!message) return "El mensaje es obligatorio";
    if (message.length > 500)
      return "El mensaje debe ser menor que 500 caracteres";
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "subject":
        error = validateSubject(value);
        break;
      case "message":
        error = validateMessage(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/email/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(await response.json());
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        subject: "",
        message: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "Error al enviar el formulario. Por favor intente más tarde.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
        <h2 className="text-2xl font-bold mb-2">¡Gracias por contactarnos!</h2>
        <p>
          Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Solicita nuestros servicios
      </h2>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {errors.form}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Nombre:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.email}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Teléfono:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.phone
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
          placeholder="10 dígitos"
        />
        {errors.phone && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.phone}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="subject"
          className="block text-gray-700 font-medium mb-2"
        >
          Asunto:
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.subject
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
        />
        {errors.subject && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.subject}
          </span>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-gray-700 font-medium mb-2"
        >
          Mensaje:
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.message
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
        />
        {errors.message && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md cursor-pointer text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        }`}
      >
        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
      </button>
    </form>
  );
}
