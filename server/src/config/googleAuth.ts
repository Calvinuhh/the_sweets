import { OAuth2Client } from "google-auth-library";

const { GOOGLE_CLIENT_ID } = process.env as {
  GOOGLE_CLIENT_ID: string;
};

export const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Token inválido");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.given_name || "",
      lastname: payload.family_name || "",
      verified: payload.email_verified,
    };
  } catch (error) {
    throw new Error("Token de Google inválido");
  }
};
