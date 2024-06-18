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

// GET request to fetch a specific section by ID
app.get('/api/sections/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM sections WHERE sectionid = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Assuming sectionid is unique, return the first (and only) result
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete('/api/sections/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Deleting", id);
  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    const deleteQuery = 'DELETE FROM sections WHERE sectionid = $1';
    const result = await client.query(deleteQuery, [id]);
    await client.query('COMMIT');
    client.release();
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/sections', async (req, res) => {
  const { sectionid, isonline } = req.body; // Assuming body-parser or express.json() middleware is used

  try {
    // Insert into database
    const result = await pool.query('INSERT INTO sections (sectionid, isonline) VALUES ($1, $2) RETURNING *', [sectionid, isonline]);

    // Respond with the newly created section data
    res.status(201).json(result.rows[0]); // 201 status code for resource creation
  } catch (error) {
    console.error('Error creating new section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
