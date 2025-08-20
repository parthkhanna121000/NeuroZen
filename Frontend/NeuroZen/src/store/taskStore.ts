import { create } from "zustand";

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  deadline?: string;
  subtasks?: Subtask[];
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

type TaskState = {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  addTask: (columnId: string, task: Partial<Task>) => void;
  moveTask: (
    taskId: string,
    sourceCol: string,
    destCol: string,
    index: number
  ) => void;
  editTask: (taskId: string, newTitle: string) => void;
  editTaskDetails: (taskId: string, updated: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: {
    "1": {
      id: "1",
      title: "Build Zustand Store",
      description: "Set up store for Kanban board",
      labels: ["coding"],
      deadline: "2025-08-20",
    },
    "2": {
      id: "2",
      title: "Setup Tailwind",
      labels: ["frontend"],
      deadline: "2025-08-18",
    },
  },
  columns: {
    todo: { id: "todo", title: "To Do", taskIds: ["1"] },
    inprogress: { id: "inprogress", title: "In Progress", taskIds: ["2"] },
    pending: { id: "pending", title: "Pending", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },

  addTask: (columnId, task) =>
    set((state) => {
      const id = Date.now().toString();
      const newTask: Task = {
        id,
        title: task.title || "New Task",
        description: task.description,
        labels: task.labels,
        deadline: task.deadline,
      };
      return {
        tasks: {
          ...state.tasks,
          [id]: newTask,
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            taskIds: [...state.columns[columnId].taskIds, id],
          },
        },
      };
    }),

  moveTask: (taskId, sourceCol, destCol, index) =>
    set((state) => {
      const sourceTasks = state.columns[sourceCol].taskIds.filter(
        (id) => id !== taskId
      );
      const destTasks = [...state.columns[destCol].taskIds];
      destTasks.splice(index, 0, taskId);
      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceCol]: {
            ...state.columns[sourceCol],
            taskIds: sourceTasks,
          },
          [destCol]: {
            ...state.columns[destCol],
            taskIds: destTasks,
          },
        },
      };
    }),

  editTask: (taskId, newTitle) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], title: newTitle },
      },
    })),

  editTaskDetails: (taskId, updated) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], ...updated },
      },
    })),

  deleteTask: (taskId) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[taskId];
      const newColumns = Object.fromEntries(
        Object.entries(state.columns).map(([colId, col]) => [
          colId,
          { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) },
        ])
      );
      return { tasks: newTasks, columns: newColumns };
    }),
}));
