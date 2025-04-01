import { Resend } from "resend";

process.loadEnvFile();
const { RESEND_API_KEY, EMAIL } = process.env as {
  [key: string]: string;
};

const resend = new Resend(RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  portion?: number;
  purchaseType: string;
  additions?: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

interface CheckoutInfo {
  items: OrderItem[];
  total: number;
}

export default async function sendClientEmail(
  name: string,
  subject: string,
  message: string,
  email: string,
  phone: string
) {
  try {
    const send = await resend.emails.send({
      from: "The Sweet S <onboarding@resend.dev>",
      to: [EMAIL],
      subject: subject,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f4e8; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #d4a762; font-size: 24px; margin-bottom: 5px;">The Sweet S</h1>
              <p style="color: #888; font-size: 14px;">Pastelería Artesanal</p>
            </div>
            
            <div style="background-color: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <h2 style="color: #d4a762; font-size: 20px; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                Nuevo mensaje de contacto
              </h2>
              
              <div style="margin-bottom: 20px;">
                <p style="font-size: 16px; line-height: 1.6; color: #555;">${message}</p>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <h3 style="font-size: 16px; margin-top: 0; color: #d4a762;">Información del cliente:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 80px; color: #777; padding: 5px 0;">Nombre:</td>
                    <td style="font-weight: 500; padding: 5px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="color: #777; padding: 5px 0;">Email:</td>
                    <td style="padding: 5px 0;">
                      <a href="mailto:${email}" style="color: #d4a762; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #777; padding: 5px 0;">Teléfono:</td>
                    <td style="padding: 5px 0;">
                      <a href="tel:${phone}" style="color: #333; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
              <p>© ${new Date().getFullYear()} The Sweet S. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      `,
    });

    return send;
  } catch (error: any) {
    throw Error(error.message);
  }
}

export const sendClientApplication = async (
  name: string,
  email: string,
  phone: string,
  checkoutInfo: CheckoutInfo
) => {
  try {
    const itemsHtml = checkoutInfo.items
      .map(
        (item) => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        <h3 style="margin: 0; color: #333;">${item.name}</h3>
        <p style="margin: 5px 0; color: #555;">
          ${
            item.purchaseType === "quantity"
              ? `Cantidad: ${item.quantity} ${item.quantity === 1 ? "unidad" : "unidades"}`
              : `Porciones: ${item.portion} ${item.portion === 1 ? "porción" : "porciones"}`
          }
        </p>
        <p style="margin: 5px 0; color: #555;">
          Precio: $${item.totalPrice.toLocaleString()}
        </p>
        ${
          item.additions && item.additions.length > 0
            ? `
          <div style="margin-top: 10px;">
            <p style="margin: 5px 0; font-weight: bold; color: #555;">Adiciones:</p>
            <ul style="margin: 5px 0; padding-left: 20px; color: #555;">
              ${item.additions
                .map(
                  (addition) => `
                <li>${addition.name} (+ $${addition.price.toLocaleString()})</li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    `
      )
      .join("");

    const send = await resend.emails.send({
      from: "The Sweet S <onboarding@resend.dev>",
      to: [EMAIL],
      subject: `Solicitud de Pedido - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568;">¡Nueva Solicitud de Pedido!</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2d3748; margin-top: 0;">Datos del Cliente</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2d3748; margin-top: 0;">Detalles del Pedido</h2>
            ${itemsHtml}
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
              <h3 style="margin: 0; color: #2d3748;">Total del Pedido:</h3>
              <p style="font-size: 18px; font-weight: bold; color: #2b6cb0;">
                $${checkoutInfo.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return send;
  } catch (error: any) {
    throw Error(error.message);
  }
};
