import { Router } from "express";
import {
  RegisterSchema,
  LoginSchema,
  ResetPasswordSchema,
} from "../schemas/auth.schema";

import { User } from "../../generated/prisma/client";

import bcrypt from "bcrypt";
import crypto from "crypto";

import {
  createPendingRegistration,
  getPendingRegistrationByEmail,
  updatePendingRegistration,
  deletePendingRegistration,
} from "../repositories/pendingRegister.repository";

import {
  getUserByEmail,
  getUserById,
  updateUserPassword,
  newUser,
} from "../repositories/user.repository";

import { generateToken } from "../utils/jwt";
import { authMiddleware } from "../middlewares/auth.middleware";

import {
  createVerificationCode,
  deleteVerificationCode,
  deleteVerificationCodes,
  getVerificationCode,
} from "../repositories/passwordReset.repository";

import {
  sendPasswordResetEmail,
  sendRegistrationVerificationEmail,
} from "../services/email.service";

const router = Router();

router.get("/privateTest", authMiddleware, (req: any, res: any) => {
  res.json({ message: "rota privada acessada" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "E-mail já cadastrado.",
      });
    }

    // Gera o código que será enviado por e-mail
    const verificationCode = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Hash do código para salvar no banco
    const hashedVerificationCode = await bcrypt.hash(
      verificationCode,
      10
    );

    // Código válido por 10 minutos
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Hash da senha
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const existingPending =
      await getPendingRegistrationByEmail(email);

    if (existingPending) {
      await updatePendingRegistration(
        email,
        name,
        hashedPassword,
        hashedVerificationCode,
        expiresAt
      );
    } else {
      await createPendingRegistration(
        name,
        email,
        hashedPassword,
        hashedVerificationCode,
        expiresAt
      );
    }

    // Envia o código ORIGINAL para o usuário
    await sendRegistrationVerificationEmail(
      email,
      verificationCode
    );

    return res.status(200).json({
      message:
        "Um código de verificação foi enviado para seu e-mail.",
    });
  } catch (error) {

    return res.status(500).json({
      message: "Erro interno do servidor.",
    });
  }
});

router.post("/verify-register", async (req, res) => {
  try {
    const { email, code } = req.body;


    const pendingRegistration =
      await getPendingRegistrationByEmail(email);

    if (!pendingRegistration) {

      return res.status(400).json({
        message: "Registration not found.",
      });
    }


    if (
      pendingRegistration.expiresAt.getTime() <
      Date.now()
    ) {

      return res.status(400).json({
        message: "Verification code expired.",
      });
    }

    const isValidCode = await bcrypt.compare(
      code.toString(),
      pendingRegistration.verificationCode
    );


    if (!isValidCode) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    const user = await newUser(
      pendingRegistration.name,
      pendingRegistration.email,
      pendingRegistration.password
    );

    await deletePendingRegistration(email);


    return res.status(201).json({
      message: "Registration completed successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: "User not authenticated",
    });
  }

  try {
    const user: User | null = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    console.error(
      "Error on fetching authenticated user:",
      JSON.stringify(error, null, 2),
    );

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user: User | null = await getUserByEmail(email);

    // Não revela se o e-mail está cadastrado
    if (!user) {
      return res.status(200).json({
        message:
          "If this email is registered, a verification code has been sent.",
      });
    }

    // Remove códigos anteriores desse e-mail
    await deleteVerificationCodes(email);

    // Gera novo código
    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    // Código válido por 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Salva o código
    const verificationCodeData = await createVerificationCode(
      email,
      verificationCode,
      expiresAt,
    );

    try {
      // Tenta enviar o e-mail
      await sendPasswordResetEmail(email, verificationCode);
    } catch (error) {
      // Se o envio falhar, remove o código criado
      await deleteVerificationCode(verificationCodeData.id);

      console.error("Failed to send password reset email:", error);

      return res.status(500).json({
        error: "Failed to send verification email.",
      });
    }

    return res.status(200).json({
      message:
        "If this email is registered, a verification code has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    const verification = await getVerificationCode(email, code);

    if (!verification) {
      return res.status(400).json({
        error: "Invalid verification code.",
      });
    }

    if (verification.expiresAt < new Date()) {
      await deleteVerificationCode(verification.id);

      return res.status(400).json({
        error: "Verification code has expired.",
      });
    }

    return res.status(200).json({
      success: "Verification code is valid.",
    });
  } catch (error) {
    console.error("Verify reset code error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const result = ResetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid data.",
        details: result.error.issues,
      });
    }

    const { email, code, password } = result.data;

    const verification = await getVerificationCode(
      email,
      code
    );

    if (!verification) {
      return res.status(400).json({
        error: "Invalid verification code.",
      });
    }

    if (verification.expiresAt < new Date()) {
      await deleteVerificationCode(verification.id);

      return res.status(400).json({
        error: "Verification code has expired.",
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "Unable to reset password.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await updateUserPassword(
      user.id,
      hashedPassword
    );

    await deleteVerificationCode(
      verification.id
    );

    return res.status(200).json({
      success: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

export default router;
