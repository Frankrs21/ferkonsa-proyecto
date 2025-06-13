require('dotenv').config();
const express = require('express');
const app = express();

const authRoutes = require('./routes/auth.routes');
const approveRoutes = require('./routes/approve.routes');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/approve', approveRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Auth-Service corriendo en puerto ${PORT}`);
});

// auth-service/src/db/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool;