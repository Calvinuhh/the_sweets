import { Request, Response } from "express";
import {
  validateEmail,
  validateMaxLength,
  validateName,
  validatePhone,
} from "../utils/validations";
import sendClientEmail from "../config/email";
import { sendClientApplication } from "../config/email";

interface OrderItem {
  name: string;
  quantity: number;
  portion?: number;
  purchaseType: string;
  additions?: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

interface OrderRequest {
  name: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
}

export const sendEmailClientController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, subject, message, email, phone } = req.body;

    if (!name || !subject || !message || !email || !phone) {
      throw Error("Todos los campos son obligatorios");
    }

    validateName(name);
    validateMaxLength(name, 100, "name");
    validateMaxLength(subject, 300, "subject");
    validateMaxLength(message, 500, "message");
    validateEmail(email);
    validatePhone(phone);

    res
      .status(200)
      .json(await sendClientEmail(name, subject, message, email, phone));
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

export const sendEmailRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, phone, items, total }: OrderRequest = req.body;

    if (!name || !email || !phone || !items || !total) {
      throw Error("Todos los campos son obligatorios");
    }

    validateName(name);
    validateEmail(email);
    validatePhone(phone);

    const result = await sendClientApplication(name, email, phone, {
      items,
      total,
    });

    res.status(200).json({
      success: true,
      message: "Solicitud de pedido enviada correctamente",
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};
