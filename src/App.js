import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from "framer-motion"; // Import Framer Motion

function App() {
  // State untuk menyimpan daftar tugas, newTask, prioritas, dan dark mode
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Menyimpan daftar tugas ke local storage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Fungsi untuk menambahkan atau menyimpan perubahan pada tugas
  const addTask = () => {
    if (newTask.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Tugas tidak boleh kosong!',
      });
    } else {
      if (isEditing) {
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? { text: newTask, priority } : task
        );
        setTasks(updatedTasks);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        const newTaskObject = { text: newTask, priority };
        setTasks([...tasks, newTaskObject]);
      }
      setNewTask(""); // Reset input
      setPriority("medium"); // Reset prioritas
    }
  };

  // Fungsi untuk mengedit tugas
  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setNewTask(taskToEdit.text);
    setPriority(taskToEdit.priority);
    setIsEditing(true);
    setEditIndex(index);
  };

  // Fungsi untuk menghapus tugas dengan konfirmasi SweetAlert2
  const removeTask = (index) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak bisa mengembalikan tugas ini setelah dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTasks = tasks.filter((_, i) => i !== index); // Hapus tugas dari list
        setTasks(updatedTasks);

        // Menampilkan notifikasi bahwa tugas berhasil dihapus
        Swal.fire(
          'Terhapus!',
          'Tugas Anda telah dihapus.',
          'success'
        );
      }
    });
  };

  // Fungsi untuk toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-black text-white">
      <h1 className="text-6xl font-extrabold mb-12">My To-Do List</h1>

      {/* Input dan Tombol Tambah */}
      <div className="flex space-x-4 mb-10 items-center">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)} // Update inputan tugas
          placeholder="Tambah tugas baru"
          className="px-6 py-3 w-80 bg-white text-gray-800 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-transform transform-gpu hover:scale-105"
        />

        {/* Dropdown untuk memilih prioritas */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)} // Update prioritas tugas
          className="px-4 py-3 bg-white text-gray-800 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-transform transform-gpu hover:scale-105"
        >
          <option value="high">Tinggi</option>
          <option value="medium">Sedang</option>
          <option value="low">Rendah</option>
        </select>

        <button
          onClick={addTask}
          className={`px-6 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform-gpu ${
            isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
          } focus:outline-none focus:ring-4 focus:ring-green-300 text-white font-semibold hover:scale-105`}
        >
          {isEditing ? "Simpan Perubahan" : "Tambah"}
        </button>
      </div>

      {/* Daftar Tugas */}
      <ul className="space-y-6 w-full max-w-lg">
        {tasks.map((task, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between bg-white text-gray-800 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform-gpu hover:scale-105"
          >
            <span className={`text-xl ${
              task.priority === "high" ? "text-red-500" : task.priority === "low" ? "text-green-500" : "text-yellow-500"
            }`}>
              {task.text} - {task.priority === "high" ? "Tinggi" : task.priority === "medium" ? "Sedang" : "Rendah"}
            </span>

            <div className="space-x-2 flex">
              {/* Tombol Edit */}
              <button
                onClick={() => editTask(index)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform-gpu hover:scale-105"
              >
                Edit
              </button>

              {/* Tombol Hapus */}
              <button
                onClick={() => removeTask(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform-gpu hover:scale-105"
              >
                Hapus
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Pesan jika tidak ada tugas */}
      {tasks.length === 0 && (
        <p className="text-lg mt-10 text-gray-100">Tidak ada tugas. Tambahkan tugas untuk memulai!</p>
      )}

      {/* Tombol Toggle Dark Mode */}
      <button
        onClick={toggleDarkMode}
        className="mt-12 px-8 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform-gpu hover:scale-105"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default App;
