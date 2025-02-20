import app from "./app";

process.loadEnvFile();
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
