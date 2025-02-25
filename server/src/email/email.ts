import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY, SERVER_URL, EMAIL } = process.env as {
  [key: string]: string;
};

sgMail.setApiKey(SENDGRID_API_KEY);

export const enviarEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    await sgMail.send({
      to: email,
      from: EMAIL,
      subject: "Confirm your account",
      html: `
    <h2>Hi ${name}! click on the next link to confirm your account: </h2>
    <a href="${SERVER_URL}/auth/${token}">Confirm Account</a>
    `,
    });
  } catch (error) {
    throw Error("Error sending email");
  }
};

// HAY QUE MODIFICAR
