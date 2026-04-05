import axiosInstance from "@/lib/axiosInstance";
import { handleApiError } from "@/lib/error";

export type TaskStatus = "pending" | "inprogress" | "completed";

export interface TaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

//  Create Task
export const createTask = async (data: TaskPayload) => {
  try {
    const res = await axiosInstance.post("/tasks", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

//  Get Tasks (with pagination & filtering)
export const getTasks = async (params?: {
  page?: number;
  limit?: number;
  status?: TaskStatus;
}) => {
  try {
    const res = await axiosInstance.get("/tasks", {
      params,
    });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

//  Get Single Task
export const getTaskById = async (taskId: string) => {
  try {
    const res = await axiosInstance.get(`/tasks/${taskId}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

//  Update Task
export const updateTask = async (
  taskId: string,
  data: Partial<TaskPayload>
) => {
  try {
    const res = await axiosInstance.put(`/tasks/${taskId}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

//  Toggle Task Status
export const toggleTaskStatus = async (taskId: string) => {
  try {
    const res = await axiosInstance.patch(`/tasks/${taskId}/toggle`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

//  Delete Task
export const deleteTask = async (taskId: string) => {
  try {
    const res = await axiosInstance.delete(`/tasks/${taskId}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};