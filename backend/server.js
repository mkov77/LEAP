const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  // This changes between 'postgres' for docker and 'localhost' for non-containerized
  host: 'localhost',
  database: 'LEAP',
  password: 'admin',
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

// End point to get engagements
app.get('/api/engagements/:id', async (req, res) => {

  console.log('Attempting to engagements')
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM engagements WHERE sectionid = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// General Engagement Endpoint 
app.get('/api/engagements', async (req, res) => {

  try {
    const result = await pool.query('SELECT * FROM engagements');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get tactics
app.get('/api/tactics/:id', async (req, res) => {
  console.log('Attempting to retrieve tactics')
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tactics WHERE engagementid = $1', [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint to fetch data from 'units' table

// app.get('/api/units/sectionNullandAllianceSort', async (req, res) => {
//   const sectionid = req.query.sectionid;
//   const isFriendly = req.query.isFriendly
//   try {
//     const result = await pool.query('SELECT * FROM units WHERE (section = $1 OR section IS NULL) AND "isFriendly" = $2', [sectionid, isFriendly]);
//     console.log(result.rows);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

app.get('/api/units/sectionSort', async (req, res) => {
  const sectionid = req.query.sectionid;
  try {
    const result = await pool.query('SELECT * FROM units WHERE section = $1 AND "isFriendly" = true', [sectionid]);
    res.json(result.rows);
  } catch (err) {
    console.error('sectionid: ', [sectionid]);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.get('/api/units/enemyUnits', async (req, res) => {
  const sectionid = req.query.sectionid;
  try {
    const result = await pool.query('SELECT * FROM units WHERE section = $1 AND "isFriendly" = false AND "unit_health" != 0', [sectionid]);
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


app.delete('/api/sections/:sectionId', async (req, res) => {
  const sectionId = req.params.sectionId;

  try {
    // Step 1: Find all unit_ids associated with the section
    const unitsResult = await pool.query('SELECT unit_id FROM section_units WHERE section_id = $1', [sectionId]);
    const unitIds = unitsResult.rows.map(row => row.unit_id);

    // Step 2: Delete related data from section_tactics using the found unit_ids
    if (unitIds.length > 0) {
      await pool.query('DELETE FROM section_tactics WHERE unit_id = ANY($1::uuid[])', [unitIds]);
    }

    // Step 3: Delete related data from section_units
    await pool.query('DELETE FROM section_units WHERE section_id = $1', [sectionId]);

    // Step 4: Delete the section itself from the sections table
    const deleteResult = await pool.query('DELETE FROM sections WHERE sectionid = $1', [sectionId]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Step 5: Return a success message
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Failed to delete section' });
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

  console.log("update section status: ", id, " ", isonline)

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

app.put('/api/unitTactics/update', async (req, res) => {
  const {
    awareness,
    logistics,
    coverage,
    gps,
    comms,
    fire,
    pattern,
    ID
  } = req.body;

  try {
    // Check if the record exists
    const checkQuery = `
      SELECT * FROM unit_tactics WHERE "ID" = $1;
    `;
    const checkValues = [ID];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // Insert a new record if it doesn't exist
      const insertQuery = `
        INSERT INTO unit_tactics ("ID", awareness, logistics, coverage, gps, comms, fire, pattern)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const insertValues = [
        ID,
        awareness,
        logistics,
        coverage,
        gps,
        comms,
        fire,
        pattern
      ];

      const insertResult = await pool.query(insertQuery, insertValues);
      res.status(201).json(insertResult.rows[0]); // Return the newly inserted record
    } else {
      // Update the existing record
      const updateQuery = `
        UPDATE unit_tactics
        SET awareness = $1,
            logistics = $2,
            coverage = $3,
            gps = $4,
            comms = $5,
            fire = $6,
            pattern = $7
        WHERE "ID" = $8
        RETURNING *;
      `;
      const updateValues = [
        awareness,
        logistics,
        coverage,
        gps,
        comms,
        fire,
        pattern,
        ID
      ];

      const updateResult = await pool.query(updateQuery, updateValues);
      res.status(200).json(updateResult.rows[0]); // Return the updated record
    }

  } catch (error) {
    console.error('Error updating unit tactics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint to fetch unit tactics by ID
app.get('/api/unitTactics/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Query to fetch unit tactic by ID
    const query = `
      SELECT * FROM unit_tactics WHERE "ID" = $1;
    `;
    const values = [id];

    const result = await pool.query(query, values);

    // Check if record exists
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Unit tactics not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching unit tactics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/api/units/update', async (req, res) => {
  const {
    parent_id,
    unit_id,
    unit_type,
    unit_health,
    role_type,
    unit_size,
    force_posture,
    force_readiness,
    force_skill,
    section_id,
    root
  } = req.body;

  console.log(parent_id, unit_id);
  try {
    // Update unit details
    const updateQuery = `
      UPDATE units
      SET unit_type = $1,
          unit_health = $2,
          role_type = $3,
          unit_size = $4,
          force_posture = $5,
          force_readiness = $6,
          force_skill = $7,
          section = $8,
          root = $9
      WHERE id = $10
      RETURNING *;
    `;
    const updateValues = [
      unit_type,
      unit_health,
      role_type,
      unit_size,
      force_posture,
      force_readiness,
      force_skill,
      section_id,
      root,
      unit_id,
    ];

    const updateResult = await pool.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // Append child to parent's children array
    const appendQuery = `
    UPDATE units
    SET children = array_append(children, (
      SELECT unit_id
      FROM units
      WHERE id = $1
    ))
    WHERE id = $2;
  `;

    const appendValues = [
      unit_id,  // Child unit_id to find the name
      parent_id // Parent unit_id
    ];

    await pool.query(appendQuery, appendValues);

    res.json(updateResult.rows[0]); // Return the updated unit details
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/units/remove', async (req, res) => {
  const { section, isFriendly } = req.body;
  console.log(`Received request to remove section: ${section} with isFriendly: ${isFriendly}`);

  try {
    // Update unit details
    const updateQuery = `
      UPDATE units
      SET children = '{}',
          unit_health = 100,
          root = false,
          section = null
      WHERE section = $1 AND "isFriendly" = $2
    `;
    const updateValues = [section, isFriendly];

    const updateResult = await pool.query(updateQuery, updateValues);

    if (updateResult.rowCount > 0) {
      console.log(`Successfully updated units for section: ${section} with isFriendly: ${isFriendly}`);
      res.status(200).json({ success: true });
    } else {
      console.log(`No units found for section: ${section} with isFriendly: ${isFriendly}`);
      res.status(404).json({ success: false, message: 'No units found' });
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

// Endpoint to add a new unit
app.post('/api/newunit', async (req, res) => {
  const { unit_id, is_friendly } = req.body;

  console.log('Received request to create unit:', req.body); // Log the request body

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO units (unit_id, "is_friendly", children) VALUES ($1, $2, $3) RETURNING *',
      [unit_id, is_friendly, '{}']
    );

    console.log('Unit created:', result.rows[0]); // Log the created unit

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating unit:', error); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sectionlessunits', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, unit_id FROM units WHERE section IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete a unit by its ID
app.delete('/api/units/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Deleting unit with id:', id);
  
  try {
    // Step 1: Delete from unit_tactics table
    const deleteTacticsQuery = 'DELETE FROM unit_tactics WHERE "ID" = $1';
    await pool.query(deleteTacticsQuery, [id]);
    
    // Step 2: Delete from units table
    const deleteUnitsQuery = 'DELETE FROM units WHERE id = $1';
    const deleteResult = await pool.query(deleteUnitsQuery, [id]);

    if (deleteResult.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Unit not found' });
    }
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get all preset units
app.get('/api/preset_units', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "preset_units"');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST Endpoint to create a new unit in 'preset_units'
app.post('/api/newpresetunit', async (req, res) => {
  const {
    unit_name,        // Should match the column names in 'preset_units'
    unit_type,
    unit_role,
    unit_size,
    unit_posture,
    unit_mobility,
    unit_readiness,
    unit_skill,
    is_friendly,
  } = req.body;

  try {
    // Insert new unit data into the 'preset_units' table
    const result = await pool.query(
      `INSERT INTO preset_units 
      (unit_name, unit_type, unit_role, unit_size, unit_posture, unit_mobility, unit_readiness, unit_skill, is_friendly)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [unit_name, unit_type, unit_role, unit_size, unit_posture, unit_mobility, unit_readiness, unit_skill, is_friendly]
    );

    // Return the created unit
    res.status(201).json({ message: 'Unit created successfully', unit: result.rows[0] });
  } catch (err) {
    console.error('Error inserting unit:', err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/sectionunits', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM section_units');
    res.json(result.rows);
  } catch (err) {
    console.error('sectionid: ', [sectionid]);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/sectionunits/sectionSort', async (req, res) => {
  const sectionid = req.query.sectionid;
  try {
    const result = await pool.query('SELECT * FROM section_units WHERE section_id = $1 AND "is_friendly"::boolean = true', [sectionid]);
    res.json(result.rows);
  } catch (err) {
    console.error('sectionid: ', [sectionid]);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.get('/api/units/sectionNullandAllianceSort', async (req, res) => {
  const sectionid = req.query.sectionid;
  const isFriendly = req.query.isFriendly
  try {
    const result = await pool.query('SELECT * FROM section_units WHERE (section_id = $1 OR section_id IS NULL) AND "is_friendly" = $2', [sectionid, isFriendly]);
    // console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint to make record tactics
app.post('/api/newpresetunit/tactics', async (req, res) => {
  console.log("Attempting to store tactics record");

  const {
    unit_name, // Added unit_name for referencing the unit
    awareness,
    logistics,
    coverage,
    gps,
    comms,
    fire,
    pattern
  } = req.body;

  try {
    // Insert into the `preset_tactics` table
    const result = await pool.query(
      `INSERT INTO preset_tactics (unit_name, awareness, logistics, coverage, gps, comms, fire, pattern)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        unit_name,
        awareness,
        logistics,
        coverage,
        gps,
        comms,
        fire,
        pattern
      ]
    );

    // Respond with the inserted row
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error recording tactics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST endpoint to add a new node to the section_units table
app.post('/api/section_units', async (req, res) => {
  const {
    unit_name,
    unit_health,
    unit_type,
    unit_role,
    unit_size,
    unit_posture,
    unit_mobility,
    unit_readiness,
    unit_skill,
    is_friendly,
    is_root,
    section_id
  } = req.body;

  try {
    // SQL query to insert a new node
    const query = `
      INSERT INTO section_units (
        unit_name, unit_health, unit_type, unit_role, 
        unit_size, unit_posture, unit_mobility, unit_readiness, 
        unit_skill, is_friendly, is_root, section_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING *;
    `;

    // Execute the query with the provided values
    const result = await pool.query(query, [
      unit_name,
      unit_health,
      unit_type,
      unit_role,
      unit_size,
      unit_posture,
      unit_mobility,
      unit_readiness,
      unit_skill,
      is_friendly,
      is_root,
      section_id
    ]);

    // Return the inserted record as the response
    res.status(201).json({
      message: 'Node added successfully',
      node: result.rows[0],
    });

  } catch (err) {
    console.error('Error inserting node into section_units:', err);
    res.status(500).json({
      error: 'Error adding node to section_units',
      details: err.message,
    });
  }
});

// API endpoint to add a new entry to section_tactics
app.post('/api/tactics/add', async (req, res) => {
  const { awareness, logistics, coverage, gps, comms, fire, pattern } = req.body;

  try {
      // Insert the new row into the section_tactics table
      const newTactic = await pool.query(
          `INSERT INTO section_tactics (awareness, logistics, coverage, gps, comms, fire, pattern) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [awareness, logistics, coverage, gps, comms, fire, pattern]
      );

      // Respond with the inserted row
      res.status(201).json(newTactic.rows[0]);
  } catch (error) {
      console.error('Error inserting new tactic:', error);
      res.status(500).json({ error: 'Failed to insert new tactic' });
  }
});

app.put('/api/section_units/:parentId/addChild', async (req, res) => {
  const { parentId } = req.params;
  const { childId } = req.body;

  console.log("Child and parent: ", parentId, " ", childId);

  try {
    // First, check if the parent unit exists
    const parentResult = await pool.query('SELECT * FROM section_units WHERE unit_id = $1', [parentId]);

    if (parentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Parent unit not found' });
    }

    // Get the current children array, assuming it's stored as a PostgreSQL array
    const parentUnit = parentResult.rows[0];
    const currentChildren = parentUnit.children || [];

    // Check if childId already exists in children
    if (currentChildren.includes(childId)) {
      return res.status(400).json({ error: 'Child already exists in parent' });
    }

    // Update the children array by adding the new childId
    const updatedChildren = [...currentChildren, childId];

    // Update the parent unit with the new children array
    await pool.query(
      'UPDATE section_units SET children = $1 WHERE unit_id = $2',
      [updatedChildren, parentId]
    );

    res.status(200).json({ message: 'Child node added successfully' });
  } catch (error) {
    console.error('Error adding child node:', error);
    res.status(500).json({ error: 'Failed to add child node' });
  }
});


// Endpoint to make record tactics
app.post('/api/newsectionunit/tactics', async (req, res) => {
  console.log("Attempting to store tactics record");

  const {
    unit_name, // Added unit_name for referencing the unit
    awareness,
    logistics,
    coverage,
    gps,
    comms,
    fire,
    pattern
  } = req.body;

  try {
    // Insert into the `section_tactics` table
    const result = await pool.query(
      `INSERT INTO section_tactics (awareness, logistics, coverage, gps, comms, fire, pattern)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        awareness,
        logistics,
        coverage,
        gps,
        comms,
        fire,
        pattern
      ]
    );

    // Respond with the inserted row
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error recording tactics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to fetch tactics from preset_tactics table based on unit_name
app.get('/api/preset_tactics', async (req, res) => {
  try {
    // Extract unit_name from query parameters
    const { unit_name } = req.query;

    if (!unit_name) {
      return res.status(400).json({ error: 'unit_name parameter is required.' });
    }

    // Query the database for tactics where the unit_name matches
    const result = await pool.query(
      `SELECT awareness, logistics, coverage, gps, comms, fire, pattern
       FROM preset_tactics
       WHERE unit_name = $1`,
      [unit_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No tactics found for the given unit_name.' });
    }

    // Send the fetched tactics back in the response
    res.status(200).json({ tactics: result.rows[0] });

  } catch (error) {
    console.error('Error fetching tactics:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/sections/copy', async (req, res) => {
  const { originalSectionId, newSectionId } = req.body;

  try {
    // Step 1: Check if the new section ID already exists
    const checkSectionIdExists = await pool.query(
      'SELECT sectionid FROM sections WHERE sectionid = $1',
      [newSectionId]
    );

    if (checkSectionIdExists.rowCount > 0) {
      return res.status(400).json({ message: 'Section ID already exists. Please choose a unique ID.' });
    }

    // Step 2: Create the new section
    await pool.query('INSERT INTO sections (sectionid, isonline) VALUES ($1, false)', [newSectionId]);

    // Step 3: Copy all units from the original section to the new section
    const units = await pool.query('SELECT * FROM section_units WHERE section_id = $1', [originalSectionId]);

    const newUnitIds = {}; // This will store a mapping of original `unit_id` to new `unit_id`

    const unitInsertPromises = units.rows.map(async (unit) => {
      // Insert each unit into the new section and generate a new `unit_id`
      const newUnit = await pool.query(
        `INSERT INTO section_units (unit_name, unit_health, unit_type, unit_role, unit_size, unit_posture,
        unit_mobility, unit_readiness, unit_skill, is_friendly, is_root, section_id, children)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING unit_id`,
        [
          unit.unit_name, unit.unit_health, unit.unit_type, unit.unit_role, unit.unit_size, unit.unit_posture,
          unit.unit_mobility, unit.unit_readiness, unit.unit_skill, unit.is_friendly, unit.is_root, newSectionId, unit.children
        ]
      );

      const newUnitId = newUnit.rows[0].unit_id;
      newUnitIds[unit.unit_id] = newUnitId; // Map original `unit_id` to the new `unit_id`

      // Return the promise
      return newUnit;
    });

    await Promise.all(unitInsertPromises);

    // Step 4: Copy all tactics from the original section to the new section based on the new unit_id mapping
    const tactics = await pool.query('SELECT * FROM section_tactics WHERE unit_id = ANY($1)', [units.rows.map(u => u.unit_id)]);

    const tacticInsertPromises = tactics.rows.map((tactic) => {
      const newUnitId = newUnitIds[tactic.unit_id]; // Get the new `unit_id` from the mapping

      return pool.query(
        `INSERT INTO section_tactics (unit_id, awareness, logistics, coverage, gps, comms, fire, pattern)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [newUnitId, tactic.awareness, tactic.logistics, tactic.coverage, tactic.gps, tactic.comms, tactic.fire, tactic.pattern]
      );
    });

    await Promise.all(tacticInsertPromises);

    res.status(200).json({ message: 'Section and units copied successfully' });
  } catch (error) {
    console.error('Error copying section:', error);
    res.status(500).json({ message: 'Error copying section' });
  }
});


// Endpoint to fetch children based on parent_id
app.get('/api/units/children', async (req, res) => {
  const { parent_id } = req.query;

  try {
    // Query to fetch child units by parent_id
    const result = await pool.query(`
      SELECT child_id, parent_id FROM section_tree
      WHERE parent_id = $1
    `, [parent_id]);

    // Log the result of the query to check if children are found
    console.log("Parent " , parent_id, " has children: ", result.rows);

    // Check if any children are returned
    if (result.rows.length === 0) {
      console.log("No children found for parent_id:", parent_id);
    }

    // Return children data as JSON
    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error while fetching children." });
  }
});


app.get('/api/unit/:unitId', async (req, res) => {
  const { unitId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM section_units WHERE unit_id = $1', [unitId]);
    res.json(result.rows);
    console.log("unit: ", result.rows);
  } catch (err) {
    console.error('unitId: ', [unitId]);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});