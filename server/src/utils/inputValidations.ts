export const validateName = (name: string) => {
  if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(name))
    throw Error("El nombre solo puede contener letras, números y espacios");
};

export const validatePrice = (price: number) => {
  if (isNaN(price)) throw Error("El precio debe ser un numero");
  if (price <= 999)
    throw Error("El precio debe ser un número mayor o igual a 1000");
};

export const validateDessertTypes = (type: string) => {
  if (
    type !== "postre_frio" &&
    type !== "galleta" &&
    type !== "rollo" &&
    type !== "torta"
  )
    throw Error(
      "Los tipos de postre permitidos son: 'postre_frio', 'galleta', 'rollo' y 'torta'"
    );
};
