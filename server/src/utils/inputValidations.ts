export const validateLettersAndNumbers = (name: string) => {
  if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(name))
    throw Error(
      "El nombre solo puede tener letras y numeros, no caracteres especiales"
    );
};
