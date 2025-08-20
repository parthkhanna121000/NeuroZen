import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../store/taskStore"; // runtime
import type { Task } from "../store/taskStore"; // type-only import

type Props = {
  columnId: string;
  title: string;
};

const colorMap: Record<string, { border: string; bg: string }> = {
  todo: { border: "border-purple-500", bg: "bg-purple-100" },
  inprogress: { border: "border-blue-500", bg: "bg-blue-100" },
  pending: { border: "border-yellow-500", bg: "bg-yellow-100" },
  done: { border: "border-green-500", bg: "bg-green-100" },
};

export default function TaskColumn({ columnId, title }: Props) {
  const { columns, tasks, addTask } = useTaskStore();
  const { border, bg } = colorMap[columnId];

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    labels: [],
    deadline: "",
  });

  const handleAddTask = () => {
    if (!newTask.title?.trim()) return;
    addTask(columnId, newTask);
    setNewTask({ title: "", description: "", labels: [], deadline: "" });
    setIsAdding(false);
  };

  return (
    <div
      className={`w-full md:w-80 bg-white rounded-2xl p-4 border-t-8 ${border} shadow-lg`}
    >
      <h2 className="font-semibold text-lg mb-3 text-gray-800">{title}</h2>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[200px]"
          >
            {columns[columnId].taskIds.map((taskId, index) => (
              <TaskCard
                key={taskId}
                task={tasks[taskId]}
                index={index}
                color={border}
                bgColor={bg}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAdding ? (
        <div className="mt-4 p-3 border rounded-xl bg-gray-50 flex flex-col gap-2 shadow-sm">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            className="p-2 border rounded-lg w-full"
            autoFocus
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description (optional)"
            className="p-2 border rounded-lg w-full"
          />
          <input
            type="text"
            value={newTask.labels?.join(",")}
            onChange={(e) =>
              setNewTask({ ...newTask, labels: e.target.value.split(",") })
            }
            placeholder="Labels (comma separated)"
            className="p-2 border rounded-lg w-full"
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({ ...newTask, deadline: e.target.value })
            }
            className="p-2 border rounded-lg w-full"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              ✔ Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTask({
                  title: "",
                  description: "",
                  labels: [],
                  deadline: "",
                });
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
