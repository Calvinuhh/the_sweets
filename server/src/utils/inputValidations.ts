export const validateName = (name: string, num1: number, num2: number) => {
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name))
    throw Error(
      "El nombre solo puede tener letras y espacios, no numeros o caracteres especiales"
    );

  if (name.length < num1 || name.length > num2)
    throw Error(`El nombre debe ser entre ${num1} y ${num2} caracteres`);
};

export const validateEmail = (email: string) => {
  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
    throw Error("Formato de email invalido");
};

export const validatePassword = (password: string) => {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
    throw Error(
      "La contraseña debe tener minimo una letra minuscula, una mayuscula, un numero, un caracter especial y minimo 8 caracteres"
    );
};
