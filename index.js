const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
const mariadb = require('mariadb');

app.use(cors());
app.use(express.json());

// MariaDB connection pool
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "Ralf2008",
  connectionLimit: 5,
  database: "emotion_database"
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Test route
app.get('/:comment/:user', (req, res) => {
  res.send('Kommentaar: ' + req.params.comment + ' Nimi: ' + req.params.user);
});

// POST /emotions – lisa uus emotsioon
app.post('/emotions', async (req, res) => {
  const { emotion_label, name } = req.body;
  try {
    await persistEntry(emotion_label, name);
    res.status(201).json({ message: "Emotion saved successfully", emotion_label });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /emotions – tagastab kõik emotsioonid koos nimed ja ajaga
app.get('/emotions', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT emotion_label, name, entry_time FROM emotion");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

// GET /emotions/stats – tagastab, mitu korda iga emotsioon lisatud
app.get('/emotions/stats', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT emotion_label, COUNT(*) AS count
      FROM emotion
      GROUP BY emotion_label
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

// Funktsioon, mis salvestab emotsiooni andmebaasi
const persistEntry = async (emotion_label, name) => {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(
      "INSERT INTO emotion (emotion_label, name) VALUES (?, ?)",
      [emotion_label, name]
    );
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// Käivitame serveri
app.listen(port, () => {
  console.log('Backend töötab port', port);
});
