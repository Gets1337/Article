import { getPrismaClient } from '../db/index.js';

export const createUser = (fullName, email, password) =>
  getPrismaClient().user.create({
    data: {
      full_name: fullName,
      email,
      password,
    },
  });

export const getUserByEmail = (email) =>
  getPrismaClient().user.findUnique({
    where: { email: email },
  });

export const getUserById = (id) =>
  getPrismaClient().user.findUnique({
    where: { id: id },
  });
