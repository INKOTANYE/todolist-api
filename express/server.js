const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require('colors');
const path = require("path");
const serverless = require("serverless-http");
const bodyParser = require('body-parser');
const { json } = require("body-parser");
const { nanoid } = require("nanoid");

dotenv.config({ path: "./config.env" });

const app = express();
const router = express.Router();


app.use(cors());
app.use(json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



let todos = [
  {
    id:1,
    title:"todo",
    completed:false
  }
];

router.get("/todos", (req, res) => res.send(todos));

router.get("/todos/clear", (req, res) => {
  todos = todos.filter((todo) => todo.completed === false);
  return res.send(todos);
});

router.post("/todos", (req, res) => {
  const todo = {  id: nanoid(), title: req.body.title, completed: false };
  todos.push(todo);
  return res.send(todo);
});

router.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((todo) => todo.id == id);
  const completed = Boolean(req.body.completed);
  if (index > -1) {
    todos[index].completed = completed;
  }
  return res.send(todos[index]);
});

router.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((todo) => todo.id == id);
  if (index > -1) {
    todos.splice(index, 1);
  }

  res.send(todos);
});

router.patch("/todos/toggleAll/:id", (req, res) => {
  const index = todos.find(todo => todo.completed === false)
  if (index){
    const changedTodos = todos.map((todo,index) => {
      const id = req.params.id;
      const completed = Boolean(req.body.completed);
      index=id;
      todo.completed = completed;
      return todo;
      }
    )
    todos=changedTodos
    return res.send(todos);
  }

  else {
    const changedTodos = todos.map((todo,index) => {
      const id = req.params.id;
      const completed = Boolean(req.body.completed);
      index=id;
      todo.completed = !completed;
      return todo;
      }
    )
    todos=changedTodos
    return res.send(todos);
  }

});

app.use(bodyParser.json());
app.use('/', router); 

module.exports = app;
module.exports.handler = serverless(app);

