"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/app/components/TaskForm";
import { getTasks, deleteTask } from "@/services/task";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

/* ================= TYPES ================= */

type TaskStatus = "pending" | "inprogress" | "completed";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
};

type GetTasksParams = {
  page: number;
  limit: number;
  status?: TaskStatus;
  search?: string;
};

type GetTasksResponse = {
  total: number;
  page: number;
  limit: number;
  tasks: Task[];
};

/* ================= COMPONENT ================= */

export default function TaskPage() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Pagination + Filters
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [search, setSearch] = useState<string>("");

  /* ================= DEBOUNCE ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FETCH TASKS ================= */

  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);

      const params: GetTasksParams = {
        page,
        limit,
        status: status || undefined,
        search: debouncedSearch || undefined,
      };

      const data: GetTasksResponse = await getTasks(params);

      setTasks(data?.tasks ?? []);
      setTotalPages(Math.ceil((data?.total ?? 0) / limit));
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Something went wrong";

      console.error(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, status, debouncedSearch]);

  const getStatusColor = (status: TaskStatus): string => {
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

  const formatStatus = (status: TaskStatus): string => {
    if (status === "inprogress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  /* ================= ACTIONS ================= */

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure?")) return;

      await deleteTask(id);
      toast.success("Task deleted");

      fetchTasks();
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || (error as any)?.message;

      toast.error(message);
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center bg-gray-200 p-3 rounded">
        <h1 className="text-2xl font-semibold">Task Page</h1>

        <button
          onClick={() => {
            setSelectedTask(null);
            setShowForm(true);
          }}
          className="bg-[var(--primary)] text-white px-4 py-1 rounded"
        >
          Add Task
        </button>
      </div>

      {/* FILTER + SEARCH */}
      <div className="flex gap-4 mt-4">
        <input
          placeholder="Search by title..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as TaskStatus | "");
          }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* FORM */}
      {showForm && (
        <TaskForm
          task={selectedTask}
          onClose={() => {
            setShowForm(false);
            setSelectedTask(null);
            fetchTasks();
          }}
        />
      )}

      {/* TABLE */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks?.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task?.id}>
                      <td className="p-2 border">{task?.title}</td>

                      <td className="p-2 border">{task?.description || "-"}</td>

                      <td className="p-2 border">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            task?.status,
                          )}`}
                        >
                          {formatStatus(task?.status)}
                        </span>
                      </td>

                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(task)}>
                            <Pencil className="w-5 h-5 text-blue-500" />
                          </button>

                          <button onClick={() => handleDelete(task?.id)}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
