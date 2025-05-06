require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const filePath = './tasks.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function loadTasks() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

app.get('/', (req, res) => {
  const tasks = loadTasks();
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/add', async (req, res) => {
  const newTask = new Task({ text: req.body.task, done: false });
  await newTask.save();
  res.redirect('/');
});

app.post('/done', async (req, res) => {
  const tasks = await Task.find();
  const task = tasks[req.body.index];
  if (task) {
    task.done = true;
    await task.save();
  }
  res.redirect('/');
});

app.post('/delete', async (req, res) => {
  const tasks = await Task.find();
  const task = tasks[req.body.index];
  if (task) await task.deleteOne();
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));