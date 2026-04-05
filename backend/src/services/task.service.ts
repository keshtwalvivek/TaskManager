import { prisma } from "../config/db";
import { TaskStatus } from "@prisma/client";

// Create Task
export const createTaskService = async (data: any, userId: string) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status || "pending",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId,
    },
  });
};

// Get Tasks (with filtering)
export const getTasksService = async (
  userId: string,
  page: number,
  limit: number,
  status?: string,
  search?: string,
) => {
  const where: any = { userId };

  if (status && ["pending", "inprogress", "completed"].includes(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      {
        title: { contains: search, mode: "insensitive" },
      },
      {
        description: { contains: search, mode: "insensitive" },
      },
    ];
  }

  const tasks = await prisma.task.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.task.count({ where });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit), // 🔥 add this
    tasks,
  };
};

// Update Task
export const updateTaskService = async (
  id: string,
  data: any,
  userId: string,
) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId) throw new Error("Unauthorized");

  return prisma.task.update({
    where: { id },
    data: {
      title: data.title ?? task.title,
      description: data.description ?? task.description,
      status: data.status ?? task.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : task.dueDate,
    },
  });
};

// Delete Task
export const deleteTaskService = async (id: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId) throw new Error("Unauthorized");

  return prisma.task.delete({ where: { id } });
};

// Toggle Task Status
export const toggleTaskStatusService = async (id: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId) throw new Error("Unauthorized");

  let newStatus: TaskStatus;

  if (task.status === TaskStatus.pending) newStatus = TaskStatus.inprogress;
  else if (task.status === TaskStatus.inprogress)
    newStatus = TaskStatus.completed;
  else newStatus = TaskStatus.pending;

  return prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
};
