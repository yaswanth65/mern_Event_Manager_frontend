import React, { useState } from 'react';
import './Create.css';

function Create() {
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      task,
      note,
      dueDate,
      completed,
    };

    try {
      const response = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        setError(result.message);
      } else {
        console.log(result);
        // Reset form fields
        setTask('');
        setNote('');
        setDueDate('');
        setCompleted(false);
        setError('');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className='container my-2'>
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Enter New Events</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Task</label>
          <input
            type="text"
            className="form-control"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Note</label>
          <input
            type="text"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label className="form-check-label">Completed</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <h3 className='complete '>Complete Your login to view tasks!</h3>
    </div>
  );
}

export default Create;
