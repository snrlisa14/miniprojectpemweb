const express = require('express');
const bodyParser = require('body-parser');
const db = require ('./config/db');
const app = express ();

//set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Endpoint untuk menambahkan kapal
app.post('/api/kapal', (req, res) => {
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;
    if (!nama_kapal || kapasitas_muatan <= 0) {
        return res.status(400).send('Invalid data');
    }
    const sql = 'INSERT INTO kapal (nama_kapal, jenis_kapal, kapasitas_muatan) VALUES (?, ?, ?)';
    db.query(sql, [nama_kapal, jenis_kapal, kapasitas_muatan], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id_kapal: result.insertId, nama_kapal, jenis_kapal, kapasitas_muatan });
    });
});

// Endpoint untuk mengambil semua kapal
app.get('/api/kapal', (req, res) => {
    const sql = 'SELECT * FROM kapal';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

// Endpoint untuk mengambil kapal berdasarkan id
app.get('/api/kapal/:id', (req, res) => {
    const sql = 'SELECT * FROM kapal WHERE id_kapal = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Kapal not found');
        res.status(200).json(result[0]);
    });
});

// Endpoint untuk memperbarui kapal
app.put('/api/kapal/:id', (req, res) => {
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;
    const sql = 'UPDATE kapal SET nama_kapal = ?, jenis_kapal = ?, kapasitas_muatan = ? WHERE id_kapal = ?';
    db.query(sql, [nama_kapal, jenis_kapal, kapasitas_muatan, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Kapal not found');
        res.status(200).send('Kapal updated successfully');
    });
});

// Endpoint untuk menghapus kapal
app.delete('/api/kapal/:id', (req, res) => {
    const sql = 'DELETE FROM kapal WHERE id_kapal = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Kapal not found');
        res.status(200).send('Kapal deleted successfully');
    });
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});