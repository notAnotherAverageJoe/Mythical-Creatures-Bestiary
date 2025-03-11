const db = require("./config/db");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
// Middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home route - Show all creatures
app.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const query = searchQuery
      ? "SELECT * FROM creatures WHERE name ILIKE $1"
      : "SELECT * FROM creatures";
    const values = searchQuery ? [`%${searchQuery}%`] : [];

    const result = await db.query(query, values);
    res.render("index", { creatures: result.rows, searchQuery });
  } catch (error) {
    console.error("Error fetching creatures:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Individual creature route - Shows details for one creature
app.get("/creature/:name", async (req, res) => {
  const creatureName = req.params.name.replace(/-/g, " ").toLowerCase();
  try {
    const result = await db.query(
      "SELECT * FROM creatures WHERE LOWER(name) = $1",
      [creatureName]
    );
    const creature = result.rows[0];

    if (!creature) {
      return res.status(404).send("<h1>Creature not found</h1>");
    }

    res.render("creature", { creature });
  } catch (error) {
    console.error("Error fetching creature:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/summon-random", async (req, res) => {
  try {
    // Query to select a random creature from the database
    const result = await db.query(
      "SELECT * FROM creatures ORDER BY RANDOM() LIMIT 1"
    );

    if (result.rows.length > 0) {
      const randomCreature = result.rows[0];
      res.render("creature", { creature: randomCreature });
    } else {
      res.status(404).send("No creatures found");
    }
  } catch (error) {
    console.error("Error fetching random creature:", error);
    res.status(500).send("Internal Server Error");
  }
});

const port = 4500;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
