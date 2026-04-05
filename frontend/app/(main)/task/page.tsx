"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/app/components/TaskForm";
import { getTasks, deleteTask } from "@/services/task"; // make sure deleteTask exists
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
};

export default function TaskPage() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  //  Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.tasks || data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Edit
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = confirm("Are you sure?");
      if (!confirmDelete) return;
      await deleteTask(id);

      toast.success("Task deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
      fetchTasks();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-200 p-3 rounded">
        <h1 className="text-2xl font-semibold">Task Page</h1>

        <button
          onClick={() => {
            setSelectedTask(null); // reset edit mode
            setShowForm(true);
          }}
          className="bg-[var(--primary)] text-white px-4 py-1 rounded hover:bg-[var(--primary-dark)]"
        >
          Add Task
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <TaskForm
          task={selectedTask} // pass task for edit
          onClose={() => {
            setShowForm(false);
            setSelectedTask(null);
            fetchTasks();
          }}
        />
      )}

      {/* Table */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="p-2 border">{task.title}</td>
                    <td className="p-2 border">{task.description || "-"}</td>

                    {/* Status badge */}
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 rounded hover:bg-gray-100 text-blue-500"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded hover:bg-gray-100 text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
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
        )}
      </div>
    </div>
  );
}
