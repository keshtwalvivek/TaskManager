"use client";

import { useForm } from "react-hook-form";
import { X, FileText, AlignLeft, CalendarDays, ListTodo } from "lucide-react";
import { createTask, updateTask } from "@/services/task";
import { toast } from "react-toastify";
import { useEffect } from "react";

type TaskStatus = "pending" | "inprogress" | "completed";
type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
};

export default function TaskForm({
  task,
  onClose,
}: {
  task?: any;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>();

  const selectedStatus = watch("status");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      let res;
      if (task) {
        //  UPDATE
        res = await updateTask(task.id, data);
        toast.success(res?.message || "Task updated successfully");
      } else {
        //  CREATE
        res = await createTask(data);
        toast.success(res?.message || "Task created successfully");
      }

      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "inprogress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title</label>
            <div className="flex items-center border rounded px-2">
              <FileText className="text-gray-400 mr-2" size={18} />
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full p-2 outline-none"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <div className="flex items-start border rounded px-2">
              <AlignLeft className="text-gray-400 mr-2 mt-2" size={18} />
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full p-2 outline-none"
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Status</label>

            <div className="flex items-center border rounded px-2">
              <ListTodo className="text-gray-400 mr-2" size={18} />
              <select
                {...register("status", { required: "Status is required" })}
                className="w-full p-2 outline-none bg-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">inprogress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}

            {selectedStatus && (
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${getStatusColor(
                  selectedStatus,
                )}`}
              >
                {selectedStatus}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Due Date</label>

            <div className="flex items-center border rounded px-2">
              <CalendarDays className="text-gray-400 mr-2" size={18} />
              <input
                type="date"
                {...register("dueDate", {
                  required: "Due date is required",
                })}
                className="w-full p-2 outline-none"
              />
            </div>

            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white px-4 py-2 rounded bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
