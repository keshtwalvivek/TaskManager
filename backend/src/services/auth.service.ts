import { prisma } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  });

  return user;
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return { user, token };
};