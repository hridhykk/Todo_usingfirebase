import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Todo"));
        const fetchedTodos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
        }));
        setTodos(fetchedTodos);
      } catch (error) {
        toast.error("Error fetching todos");
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      if (input.trim() === "") {
        toast.error("Task title cannot be empty!");
        return;
      }

      const isDuplicate = todos.some((todo) => todo.todo.toLowerCase() === input.toLowerCase());
      if (isDuplicate) {
        toast.info("Task title must be unique!");
        return;
      }

      const docRef = await addDoc(collection(db, "Todo"), { todo: input });
      setTodos([...todos, { id: docRef.id, todo: input }]);
      setInput("");
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Error adding task");
      console.error(error);
    }
  };

  const setEdit = (index) => {
    setInput(todos[index].todo);
    setEditIndex(index);
  };

  const updateTodo = async () => {
    try {
      if (input.trim() === "") {
        toast.error("Task title cannot be empty!");
        return;
      }

      const isDuplicate = todos.some(
        (todo, idx) => todo.todo.toLowerCase() === input.toLowerCase() && idx !== editIndex
      );
      if (isDuplicate) {
        toast.info("Task title must be unique!");
        return;
      }

      const todoToUpdate = todos[editIndex];
      if (todoToUpdate) {
        await updateDoc(doc(db, "Todo", todoToUpdate.id), { todo: input });
        const updatedTodos = [...todos];
        updatedTodos[editIndex].todo = input;
        setTodos(updatedTodos);
        setInput("");
        setEditIndex(-1);
        toast.success("Task updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating task");
      console.error(error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "Todo", id));
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Task removed successfully!");
    } catch (error) {
      toast.error("Error removing task");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-auto px-4"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('./img.jpg')",
      }}
    >
      <div className="container mx-auto max-w-4xl p-4">
        <div className="bg-gray-100 p-6 shadow-md rounded-lg w-full mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-center mb-4">Todo App</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Add a unique todo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="py-2 px-4 border rounded-lg w-full text-center focus:outline-none"
            />
            <button
              onClick={editIndex === -1 ? addTodo : updateTodo}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {editIndex === -1 ? "Add" : "Update"}
            </button>
          </div>
        </div>

        {todos.length > 0 && (
          <div className="mt-6 bg-gray-100 p-6 shadow-md rounded-lg w-full mx-auto max-w-md">
            <ul className="space-y-4">
              {todos.map((todo, index) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <span className="text-lg font-medium truncate">{todo.todo}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEdit(index)}
                      className="bg-gradient-to-r from-gray-400 to-gray-600 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white py-1 px-3 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
