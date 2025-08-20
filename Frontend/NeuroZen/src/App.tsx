// src/App.tsx
import Board from "./pages/Board";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold p-6">🧠 NeuroZen Task Board</h1>
      <Board />
    </div>
  );
}
