const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

pool.on("Connect", () => {
  console.log("Connected to db");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
