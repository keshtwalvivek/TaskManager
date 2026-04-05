import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/lib/error";

//  Register
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Login
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};