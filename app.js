require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const expressLayout = require("express-ejs-layouts");
const db = require("./database/db"); 
const todoDBRoutes = require("./routes/tododb.js");
const todoRoutes = require("./routes/todo.js");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");

app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/todosdb", todoDBRoutes);
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.render("index", { layout: "layouts/main-layout" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { layout: "layouts/main-layout" });
});

app.get("/todos-list", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("todos-page", { todos, layout: "layouts/main-layout" });
  });
});

app.post("/todos-list/add", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") return res.status(400).send("Task tidak boleh kosong");

  db.query("INSERT INTO todos (task) VALUES (?)", [task.trim()], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    res.redirect("/todos-list");
  });
});

app.put("/todos-list/edit/:id", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") return res.status(400).send("Task tidak boleh kosong");

  db.query("UPDATE todos SET task = ? WHERE id = ?", [task.trim(), req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    if (result.affectedRows === 0) return res.status(404).send("Tugas tidak ditemukan");
    res.redirect("/todos-list");
  });
});

app.delete("/todos-list/delete/:id", (req, res) => {
  db.query("DELETE FROM todos WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    if (result.affectedRows === 0) return res.status(404).send("Tugas tidak ditemukan");
    res.redirect("/todos-list");
  });
});

app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("todo", { todos, layout: "layouts/main-layout" });
  });
});


app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
