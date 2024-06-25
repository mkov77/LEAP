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
app.get('/api/units/sectionSort', async (req, res) => {
  const sectionid = req.query.sectionid;
  try {
    const result = await pool.query('SELECT * FROM units WHERE section = $1', [sectionid]);
    res.json(result.rows);
  } catch (err) {
    console.error('sectionid: ', [sectionid]);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/units', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM units');
    res.json(result.rows);
  } catch (err) {
    console.error('sectionid: ', [sectionid]);
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

// Endpoint to update the isonline status of a section
app.put('/api/sections/:id', async (req, res) => {
  const { id } = req.params;
  const { isonline } = req.body;

  try {
    const result = await pool.query('UPDATE sections SET isonline = $1 WHERE sectionid = $2 RETURNING *', [
      isonline,
      id,
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Respond with updated section data
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to create an engagement
app.post('/api/engagements', async (req, res) => {
  const {
    SectionID,
    FriendlyID,
    EnemyID,
    FriendlyBaseScore,
    EnemyBaseScore,
    FriendlyTacticsScore,
    EnemyTacticsScore,
    FriendlyTotalScore,
    EnemyTotalScore,
    isWin
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO engagements 
      (sectionid, friendlyid, enemyid, friendlybasescore, enemybasescore, 
       friendlytacticsscore, enemytacticsscore, friendlytotalscore, enemytotalscore, iswin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        SectionID,
        FriendlyID,
        EnemyID,
        FriendlyBaseScore,
        EnemyBaseScore,
        FriendlyTacticsScore,
        EnemyTacticsScore,
        FriendlyTotalScore,
        EnemyTotalScore,
        isWin
      ]
    );

    res.json(result.rows[0]); // Respond with the newly created engagement data
  } catch (error) {
    console.error('Error creating new engagement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to make record tactics
app.post('/api/tactics', async (req, res) => {

  console.log("Attempting to store tactics record")
  const {
    FriendlyAwareness, EnemyAwareness,
    FriendlyLogistics, EnemyLogistics, FriendlyCoverage, EnemyCoverage,
    FriendlyGPS, EnemyGPS, FriendlyComms, EnemyComms, FriendlyFire,
    EnemyFire, FriendlyPattern, EnemyPattern
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Tactics (FriendlyAwareness, EnemyAwareness, FriendlyLogistics, EnemyLogistics, FriendlyCoverage, EnemyCoverage,
       FriendlyGPS, EnemyGPS, FriendlyComms, EnemyComms, FriendlyFire, EnemyFire, FriendlyPattern, EnemyPattern)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        FriendlyAwareness, EnemyAwareness, FriendlyLogistics,
        EnemyLogistics, FriendlyCoverage, EnemyCoverage, FriendlyGPS, EnemyGPS,
        FriendlyComms, EnemyComms, FriendlyFire, EnemyFire, FriendlyPattern, EnemyPattern
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error recording tactics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/api/units/update', async (req, res) => {
  const {
    unit_id,
    unit_type,
    unit_health,
    role_type,
    unit_size,
    force_posture,
    force_readiness,
    force_skill,
  } = req.params;
 
 
  try {
    const result = await pool.query(
      `UPDATE units
           SET unit_type = $1,
               unit_health = $2,
               role_type = $3,
               unit_size = $4,
               force_posture = $5,
               force_readiness = $6,
               force_skill = $7
           WHERE unit_id = $8
           RETURNING *`,
      [
        unit_type,
        unit_health,
        role_type,
        unit_size,
        force_posture,
        force_readiness,
        force_skill,
        unit_id
      ]
    );
 
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Unit not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update the health of a unit
// app.put('/api/units', async (req, res) => {
//   const { id, health } = req.body; // Get id from request body

//   try {
//     const result = await pool.query('UPDATE units SET unit_health = $1 WHERE id = $2 RETURNING *', [
//       health,
//       id,
//     ]);

//     if (result.rows.length > 0) {
//       res.json(result.rows[0]); // Respond with updated unit data
//     } else {
//       res.status(404).json({ message: 'Unit not found' });
//     }
//   } catch (error) {
//     console.error('Error updating unit health:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


app.put('/api/units/health', async (req, res) => {
  const { id, newHealth } = req.body; // Ensure request body contains id and newHealth

  try {
    const result = await pool.query('UPDATE units SET unit_health = $1 WHERE id = $2 RETURNING *', [
      newHealth,
      id,
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Respond with updated unit data
    } else {
      res.status(404).json({ message: 'Unit not found' });
    }
  } catch (error) {
    console.error('Error updating unit health:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});