const express = require('express');
const router = express.Router();
const db = require('../database/db');


router.get('/', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});


router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json(results[0]);
    });
});


router.post('/', (req, res) => {
    const { buku } = req.body;
    if (!buku || buku.trim() === '') {
        return res.status(400).send('Tugas tidak boleh kosong');
    }

    db.query('INSERT INTO todos (buku) VALUES (?)', [buku.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newTodo = { id: results.insertId, buku: buku.trim(), completed: false };
        res.status(201).json(newTodo);
    });
});

router.put('/:id', (req, res) => {
    const { buku, completed } = req.body;

    db.query('UPDATE todos SET buku = ?, completed = ? WHERE id = ?', [buku, completed, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json({ id: req.params.id, buku, completed });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;