// To run this file:
// 1. Create a project folder (e.g., 'todo-backend').
// 2. Run 'npm init -y'.
// 3. Install dependencies: 'npm install express cors body-parser'.
// 4. Run the server: 'node server.js'.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
// --- 1. SETUP AND DEPENDENCIES ---
app.use(cors({
    origin: '*', // Allows all origins for development. Restrict this in production!
}));
app.use(bodyParser.json());
// --- 2. MOCK DATABASE / DATA DEFINITION ---
const MOCK_USER_ID = 'user-123'; 
let mockTasks = [
    // Initial task to demonstrate functionality
    { id: 'a1b2c3d', title: 'Implement Express Backend', description: 'Create the API endpoints.', priority: 'High', dueDate: '2025-11-01', estimatedTime: '5h', isCompleted: false, createdDate: new Date().toISOString() },
    { id: 'e4f5g6h', title: 'Update Frontend Fetch Calls', description: 'Replace localStorage calls with fetch.', priority: 'Medium', dueDate: '2025-11-10', estimatedTime: '2h', isCompleted: true, createdDate: new Date().toISOString() }
];
// --- 3. API ENDPOINTS (Step 5 Code) ---
// Health Check Route
app.get('/', (req, res) => {
    res.send('To-Do List API is running.');
});
// A. Read All Tasks (GET /api/tasks)
app.get('/api/tasks', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET /api/tasks: Sending ${mockTasks.length} tasks.`);
    res.status(200).json(mockTasks);
});
// B. Create New Task (POST /api/tasks)
app.post('/api/tasks', (req, res) => {
    const newTaskData = req.body;
    if (!newTaskData.title || !newTaskData.priority || !newTaskData.dueDate) {
        return res.status(400).json({ message: 'Missing required fields: title, priority, or dueDate.' });
    }
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const newTask = {
        id: newId,
        ...newTaskData, 
        isCompleted: false,
        createdDate: new Date().toISOString()
    };
    mockTasks.push(newTask);
    console.log(`[${new Date().toLocaleTimeString()}] POST /api/tasks: Task '${newTask.title}' created.`);
    res.status(201).json(newTask);
});
// C. Update Existing Task (PUT /api/tasks/:id)
app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updates = req.body;
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    console.log(`[${new Date().toLocaleTimeString()}] PUT /api/tasks/${taskId}: Task updated.`);
    res.status(200).json(mockTasks[taskIndex]);
});
// D. Delete Task (DELETE /api/tasks/:id)
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const initialLength = mockTasks.length;
    mockTasks = mockTasks.filter(t => t.id !== taskId);
    if (mockTasks.length === initialLength) {
        return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }
    console.log(`[${new Date().toLocaleTimeString()}] DELETE /api/tasks/${taskId}: Task successfully deleted.`);
    res.status(204).send(); 
});
// --- 4. SERVER START COMMAND ---
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('To connect your frontend, update all localStorage/mockDb calls to use fetch() to this API.');
});