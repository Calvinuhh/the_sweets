import FormContact from "./FormContact";
import WhatsAppLink from "./WhatsAppLink";

const ContactUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mb-[100px] font-lato">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 mt-[30px]">
        Contacta con nuestra tienda de postres
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <FormContact />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Información de contacto
            </h2>
            <p className="mb-4">📍 Dirección de la tienda</p>
            <p className="mb-4">📞 Teléfono: +57 318 8481242</p>
            <p className="mb-4">🕒 Horario: Lunes a Viernes 9am - 6pm</p>
            <WhatsAppLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
