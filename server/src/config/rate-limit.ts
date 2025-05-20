import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.",
});

export default apiLimiter;
