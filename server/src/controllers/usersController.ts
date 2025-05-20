import { register, confirmRegistration } from "../services/usersServices";
import { Request, Response } from "express";
import { UserRegistration } from "../types/User";

export const registerController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      lastname,
      country_code,
      email,
      password,
      phone,
    }: UserRegistration = req.body;

    const result = await register({
      name,
      lastname,
      country_code,
      email,
      password,
      phone,
    });

    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const confirmRegistrationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, email } = req.body;

    res.status(200).json(await confirmRegistration(token, email));
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};
