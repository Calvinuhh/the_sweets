process.loadEnvFile();
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
      "https://n8n-test-oj0t.onrender.com/webhook/user-email-activation",
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
