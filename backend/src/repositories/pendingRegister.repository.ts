import { PendingRegistration } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

async function createPendingRegistration(
  name: string,
  email: string,
  password: string,
  verificationCode: string,
  expiresAt: Date
) {
  return await prisma.pendingRegistration.create({
    data: {
      name,
      email,
      password,
      verificationCode,
      expiresAt,
    },
  });
}

async function getPendingRegistrationByEmail(
  email: string
) {
  return await prisma.pendingRegistration.findUnique({
    where: {
      email,
    },
  });
}

async function updatePendingRegistration(
  email: string,
  name: string,
  password: string,
  verificationCode: string,
  expiresAt: Date
) {
  return await prisma.pendingRegistration.update({
    where: {
      email,
    },
    data: {
      name,
      password,
      verificationCode,
      expiresAt,
    },
  });
}

async function deletePendingRegistration(
  email: string
) {
  return await prisma.pendingRegistration.delete({
    where: {
      email,
    },
  });
}

export {
  createPendingRegistration,
  getPendingRegistrationByEmail,
  updatePendingRegistration,
  deletePendingRegistration,
};