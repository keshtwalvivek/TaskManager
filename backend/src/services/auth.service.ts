import { prisma } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  });
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  // store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
};

export const refreshUserToken = async (token: string) => {
  if (!token) throw new Error("No token");

  const payload: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid token");
  }

  return jwt.sign(
    { id: user.id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );
};

export const logoutUser = async (token: string) => {
  if (!token) return;

  const payload: any = jwt.decode(token);

  await prisma.user.update({
    where: { id: payload.id },
    data: { refreshToken: null },
  });
};