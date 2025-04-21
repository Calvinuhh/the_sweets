import Swal from "sweetalert2";

export const useAlert = () => {
  const showSuccess = (message: string) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      background: "#f0fdf4",
      iconColor: "#22c55e",
    });
  };

  const showError = (message: string) => {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Error",
      text: message,
      showConfirmButton: false,
      timer: 5000,
      toast: true,
      background: "#fef2f2",
      iconColor: "#ef4444",
    });
  };

  const confirmDelete = async (options: {
    title?: string;
    text?: string;
    itemName?: string; // Hacer este parámetro opcional
    confirmText?: string;
    cancelText?: string;
    deleteFn: () => Promise<void>;
  }) => {
    // Mensaje predeterminado si no se provee itemName
    const confirmationText =
      options.text ||
      `Estás a punto de eliminar ${options.itemName ? `"${options.itemName}"` : "este elemento"}. Esta acción no se puede deshacer.`;

    const confirmResult = await Swal.fire({
      title: options.title || "¿Estás seguro?",
      text: confirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: options.confirmText || "Sí, eliminar",
      cancelButtonText: options.cancelText || "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });

    if (confirmResult.isConfirmed) {
      try {
        await options.deleteFn();

        const successMessage = options.itemName
          ? `${options.itemName} ha sido eliminado`
          : "El elemento ha sido eliminado";

        await Swal.fire({
          position: "top-end",
          title: "¡Eliminado!",
          text: successMessage,
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: "#f0fdf4",
          iconColor: "#22c55e",
        });

        return true;
      } catch (error: any) {
        showError(error.message);
        return false;
      }
    }
    return false;
  };

  return {
    showSuccess,
    showError,
    confirmDelete,
  };
};
