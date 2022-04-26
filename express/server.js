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

app.get("/todos", (req, res) => res.send(todos));

app.get("/todos/clear", (req, res) => {
  todos = todos.filter((todo) => todo.completed === false);
  return res.send(todos);
});

app.post("/todos", (req, res) => {
  const todo = {  id: nanoid(), title: req.body.title, completed: false };
  todos.push(todo);
  return res.send(todo);
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((todo) => todo.id == id);
  const completed = Boolean(req.body.completed);
  if (index > -1) {
    todos[index].completed = completed;
  }
  return res.send(todos[index]);
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((todo) => todo.id == id);
  if (index > -1) {
    todos.splice(index, 1);
  }

  res.send(todos);
});

app.patch("/todos/toggleAll/:id", (req, res) => {
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

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(todos);
  res.end();
});

router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/express/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);

const appLocal = require('./express/server');

appLocal.listen(3000, () => console.log('Local app listening on port 3000!'));