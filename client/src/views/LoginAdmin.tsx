import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/login`,
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenTimestamp", new Date().getTime().toString());

      Swal.fire({
        title: "Inicio de sesión exitoso",
        text: data.message,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      navigate("/admin");
    } catch (error: AxiosError | any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: String((error as AxiosError).response?.data),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-rose-200 flex items-center justify-center font-lato">
      <div className="bg-white p-8 rounded shadow-md w-[300px]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Sesión Administrador
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            {isLoading ? (
              <img
                src="/loading_gif.gif"
                alt="Loading..."
                className="mx-auto"
              />
            ) : (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all hover:scale-[1.1] mx-auto"
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
