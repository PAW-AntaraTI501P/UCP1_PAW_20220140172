const express = require("express");
const router = express.Router();
const db = require('../database/db');

router.get("/tambah", (req, res) => {
  res.render("tambah", { todo: null });
});

router.get("/edit/:id", (req, res) => {
  db.query("SELECT * FROM todos WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    if (rows.length === 0) return res.status(404).send("judul tidak ditemukan");
    res.render("tambah", { todo: rows[0] });
  });
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM todos", (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  db.query("SELECT * FROM todos WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    if (rows.length === 0) return res.status(404).send("judul tidak ditemukan");
    res.json(rows[0]);
  });
});

router.post("/tambah", (req, res) => {
  const { buku } = req.body;
  db.query("INSERT INTO todos (buku) VALUES (?)", [buku], (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.status(201).json({ id: result.insertId, buku });
  });
});

router.post("/edit/:id", (req, res) => {
  const { buku } = req.body;
  db.query("UPDATE todos SET buku = ? WHERE id = ?", [buku, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err.message);
    if (result.affectedRows === 0) return res.status(404).send("judul tidak ditemukan");
    res.json({ id: req.params.id, buku });
  });
});

router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM todos WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err.message);
    if (result.affectedRows === 0) return res.status(404).send("judul tidak ditemukan");
    res.status(204).send();
  });
});

module.exports = router;
