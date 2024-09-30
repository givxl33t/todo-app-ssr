import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const app = express();

let todoList = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const filter = req.query.filter || 'all'; // Default filter is 'all'
  
  // Filter todos based on the filter parameter
  let filteredTodos;
  if (filter === 'active') {
    filteredTodos = todoList.filter(todo => !todo.isCompleted);
  } else if (filter === 'completed') {
    filteredTodos = todoList.filter(todo => todo.isCompleted);
  } else {
    filteredTodos = todoList; // Default is 'all'
  }

  res.render('index', { filteredTodos, selectedTodo: null, filter });
});


app.get('/edit-todo/:id', (req, res) => {
  const todoId = req.params.id;
  const selectedTodo = todoList.find(todo => todo.id == todoId);
  const filter = req.query.filter || 'all';

  // Filter todos for displaying
  let filteredTodos;
  if (filter === 'active') {
    filteredTodos = todoList.filter(todo => !todo.isCompleted);
  } else if (filter === 'completed') {
    filteredTodos = todoList.filter(todo => todo.isCompleted);
  } else {
    filteredTodos = todoList;
  }

  res.render('index', { filteredTodos, selectedTodo, filter });
});

app.post('/add-todo', (req, res) => {
  const newTodo = {
    id: Date.now(),
    name: req.body.todoName,
    isCompleted: false
  };
  todoList.push(newTodo);
  res.redirect('/');
});

app.post('/edit-todo/:id', (req, res) => {
  const todoId = req.params.id;
  const newName = req.body.todoName;
  const filter = req.body.filter || 'all'; // Get the current filter

  todoList = todoList.map(todo => {
    if (todo.id == todoId) {
      return { ...todo, name: newName };
    }
    return todo;
  });

  res.redirect(`/?filter=${filter}`);
});

app.post('/toggle-todo/:id', (req, res) => {
  const todoId = req.params.id;
  const filter = req.body.filter || 'all';

  todoList = todoList.map(todo => {
    if (todo.id == todoId) {
      return { ...todo, isCompleted: !todo.isCompleted };
    }
    return todo;
  });

  res.redirect(`/?filter=${filter}`);
});

app.post('/delete-todo/:id', (req, res) => {
  const todoId = req.params.id;
  const filter = req.body.filter || 'all';
  todoList = todoList.filter(todo => todo.id != todoId);
  res.redirect(`/?filter=${filter}`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server started on port 3000');
});