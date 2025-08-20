import { Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import type { Task, Subtask } from "../store/taskStore";
import { useTaskStore } from "../store/taskStore";

type Props = {
  task: Task;
  index: number;
  color: string;
  bgColor: string;
};

export default function TaskCard({ task, index, color, bgColor }: Props) {
  const { editTask, editTaskDetails, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  // Subtask state
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");

  // Pomodoro timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleSaveTitle = () => {
    if (title.trim() === "") return;
    editTask(task.id, title.trim());
    setIsEditing(false);
  };

  const toggleSubtask = (id: string) => {
    const updated = subtasks.map((st) =>
      st.id === id ? { ...st, done: !st.done } : st
    );
    setSubtasks(updated);
    editTaskDetails(task.id, { subtasks: updated });
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const sub: Subtask = {
      id: Date.now().toString(),
      title: newSubtask,
      done: false,
    };
    const updated = [...subtasks, sub];
    setSubtasks(updated);
    editTaskDetails(task.id, { subtasks: updated });
    setNewSubtask("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex flex-col justify-between p-4 rounded-xl border-2 ${color} ${bgColor} shadow-lg w-64 min-h-[180px] hover:scale-105 transition-transform duration-200 cursor-pointer`}
        >
          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              className="w-full text-center border rounded-md p-1"
              autoFocus
            />
          ) : (
            <h3
              className="text-gray-900 font-semibold text-center text-lg"
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Labels */}
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels?.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 text-xs font-medium bg-gray-200 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Deadline */}
          {task.deadline && (
            <p className="text-xs text-gray-500 mt-1">Due: {task.deadline}</p>
          )}

          {/* Subtasks */}
          <div className="mt-2">
            {subtasks.map((st) => (
              <div key={st.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={st.done}
                  onChange={() => toggleSubtask(st.id)}
                  className="w-4 h-4"
                />
                <span className={st.done ? "line-through text-gray-400" : ""}>
                  {st.title}
                </span>
              </div>
            ))}

            <div className="flex gap-1 mt-1">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 p-1 text-sm border rounded-md"
                onKeyDown={(e) => e.key === "Enter" && addSubtask()}
              />
              <button
                onClick={addSubtask}
                className="px-2 bg-gray-800 text-white rounded-md"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions & Timer */}
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-2 py-1 text-green-500 hover:text-green-700 border rounded-md`}
            >
              {isRunning ? "⏸️" : "⏱️"} {formatTime(timeLeft)}
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
