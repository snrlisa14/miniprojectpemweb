const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WebSocket untuk notifikasi real-time
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User  disconnected');
    });
});

// Fungsi untuk mengirim notifikasi
function sendNotification(event, message, data) {
    io.emit('data_changed', {
        event: event,
        message: message,
        data: data
    });
}

// Create: Tambahkan data kapal baru
app.post('/api/kapal', (req, res) => {
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;

    // Validasi data
    if (!nama_kapal || kapasitas_muatan <= 0) {
        return res.status(400).json({ message: 'Nama kapal tidak boleh kosong dan kapasitas muatan harus positif.' });
    }

    const sql = 'INSERT INTO kapal (nama_kapal, jenis_kapal, kapasitas_muatan) VALUES (?, ?, ?)';
    db.query(sql, [nama_kapal, jenis_kapal, kapasitas_muatan], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding kapal', error: err });

        const newKapal = {
            id_kapal: result.insertId,
            nama_kapal,
            jenis_kapal,
            kapasitas_muatan,
            waktu_terdaftar: new Date().toISOString()
        };

        // Kirim notifikasi
        sendNotification('data_changed', 'Data kapal telah diperbarui.', [newKapal]);
        res.status(201).json(newKapal);
    });
});

// Read: Ambil data kapal
app.get('/api/kapal', (req, res) => {
    const sql = 'SELECT * FROM kapal';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching kapal', error: err });
        res.status(200).json(results);
    });
});

// Update: Perbarui data kapal berdasarkan id_kapal
app.put('/api/kapal/:id', (req, res) => {
    const { id } = req.params;
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;

    // Validasi data
    if (!nama_kapal || kapasitas_muatan <= 0) {
        return res.status(400).json({ message: 'Nama kapal tidak boleh kosong dan kapasitas muatan harus positif.' });
    }

    const sql = 'UPDATE kapal SET nama_kapal = ?, jenis_kapal = ?, kapasitas_muatan = ? WHERE id_kapal = ?';
    db.query(sql, [nama_kapal, jenis_kapal, kapasitas_muatan, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating kapal', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Kapal not found' });

        const updatedKapal = {
            id_kapal: id,
            nama_kapal,
            jenis_kapal,
            kapasitas_muatan,
            waktu_terdaftar: new Date().toISOString()
        };

        // Kirim notifikasi
        sendNotification('data_changed', 'Data kapal telah diperbarui.', [updatedKapal]);
        res.status( 200).json(updatedKapal);
    });
});

// Delete: Hapus data kapal berdasarkan id_kapal
app.delete('/api/kapal/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM kapal WHERE id_kapal = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting kapal', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Kapal not found' });

        // Kirim notifikasi
        sendNotification('data_changed', 'Data kapal telah diperbarui.', [{ id_kapal: id }]);
        res.status(204).send();
    });
});

// Menjalankan server

    console.log(`Server running on http://localhost:3000`);

