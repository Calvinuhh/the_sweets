const { HEADER_N8N_AUTH_TOKEN } = process.env as {
  HEADER_N8N_AUTH_TOKEN: string;
};

export const sendn8nEmailRegistration = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const response = await fetch(
      "https://n8n.srv834803.hstgr.cloud/webhook/user-email-activation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: HEADER_N8N_AUTH_TOKEN,
        },
        body: JSON.stringify({ email, name, token }),
      }
    );

    if (!response.ok) {
      throw Error(`Error en el webhook: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw Error(`Error al enviar el correo: ${error}`);
  }
};

export const sendn8nEmailContactForm = async (
  firstName: string,
  lastName: string,
  countryCode: string,
  phone: string,
  email: string,
  message: string
) => {
  try {
    const response = await fetch(
      "https://n8n.srv834803.hstgr.cloud/webhook/contact-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: HEADER_N8N_AUTH_TOKEN,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          countryCode,
          phone,
          email,
          message,
        }),
      }
    );

    if (!response.ok) {
      throw Error(`Error en el webhook: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw Error(`Error al enviar el correo: ${error}`);
  }
};
