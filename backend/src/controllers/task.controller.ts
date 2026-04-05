import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
  toggleTaskStatusService,
} from "../services/task.service";

export const createTask = async (req: any, res: Response) => {
  try {
    const task = await createTaskService(req.body, req.user.id);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTasks = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 5, status, search } = req.query;

    const tasks = await getTasksService(
      req.user.id,
      Number(page),
      Number(limit),
      status as string,
      search as string,
    );

    res.json(tasks);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const task = await updateTaskService(req.params.id, req.body, req.user.id);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const task = await deleteTaskService(req.params.id, req.user.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleTaskStatus = async (req: any, res: Response) => {
  try {
    const task = await toggleTaskStatusService(req.params.id, req.user.id);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
