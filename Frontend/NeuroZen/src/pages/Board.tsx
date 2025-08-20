// src/pages/Board.tsx
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import TaskColumn from "../components/TaskColumn";
import { useTaskStore } from "../store/taskStore";

const statusColors: Record<string, string> = {
  "To Do": "border-purple-500",
  "In Progress": "border-blue-500",
  Pending: "border-yellow-500",
  Done: "border-green-500",
};

export default function Board() {
  const { moveTask, columns } = useTaskStore();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    moveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6 flex flex-col gap-6">
        {/* Status Boxes */}
        <div className="flex gap-4 mb-4">
          {["To Do", "In Progress", "Pending", "Done"].map((status) => (
            <div
              key={status}
              className={`flex-1 border-2 ${statusColors[status]} rounded-lg p-4 text-center font-semibold text-gray-800`}
            >
              {status}
            </div>
          ))}
        </div>

        {/* Columns */}
        <div className="flex gap-6">
          <TaskColumn columnId="todo" title={columns.todo.title} />
          <TaskColumn columnId="inprogress" title={columns.inprogress.title} />
          <TaskColumn columnId="pending" title={columns.pending.title} />
          <TaskColumn columnId="done" title={columns.done.title} />
        </div>
      </div>
    </DragDropContext>
  );
}
