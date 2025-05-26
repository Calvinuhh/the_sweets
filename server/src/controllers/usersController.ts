import {
  register,
  confirmRegistration,
  login,
  getUserById,
  patchUserData,
  contactForm,
} from "../services/usersServices";
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

    if (result) res.status(201).json("Usuario creado correctamente");
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

    res.status(200).json(await login({ email, password }));
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    res.status(200).json(await getUserById(userId));
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const patchUserDataController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { name, lastname, country_code, phone } = req.body;

    res
      .status(200)
      .json(
        await patchUserData(userId, { name, lastname, country_code, phone })
      );
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};

export const sendContactFormDataController = async (
  req: Request,
  res: Response
) => {
  try {
    const { firstName, lastName, countryCode, phone, email, message } =
      req.body;

    res
      .status(200)
      .json(
        await contactForm(
          firstName,
          lastName,
          countryCode,
          phone,
          email,
          message
        )
      );
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      message: err.message,
    });
  }
};
