import React, { useState, useEffect } from 'react';
import './Read.css';

function Read() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ task: '', note: '', dueDate: '', completed: false });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:4000/tasks');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setFormData({ task: task.task, note: task.note, dueDate: task.dueDate.split('T')[0], completed: task.completed });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task._id === id ? updatedTask : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const TaskCard = ({ task }) => {
    return (
      <div className="card my-2">
        <div className="card-body">
          {editingTask === task._id ? (
            <form>
              <div className="mb-3">
                <label className="form-label">Task</label>
                <input
                  type="text"
                  className="form-control"
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Note</label>
                <input
                  type="text"
                  className="form-control"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                />
                <label className="form-check-label">Completed</label>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => handleUpdate(task._id)}>Update</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <h5 className="card-title">{task.task}</h5>
              <p className="card-text">{task.note}</p>
              <p className="card-text"><small className="text-muted">Due Date: {new Date(task.dueDate).toLocaleDateString()}</small></p>
              <p className="card-text">
                <small className={task.completed ? "text-success" : "text-danger"}>
                  {task.completed ? "Completed" : "Incomplete"}
                </small>
              </p>
              <button type="button" className="btn btn-warning" onClick={() => handleEdit(task)}>Edit</button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="my-3">All Events</h2>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}

export default Read;
