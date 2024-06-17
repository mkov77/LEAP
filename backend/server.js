const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: '10.0.1.226',
  database: 'LEAP',
  password: 'password',
  port: 5432,
});

// Endpoint to fetch data from 'sections' table
app.get('/api/sections', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM sections');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Endpoint to fetch data from 'units' table
  app.get('/api/units', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM units');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
