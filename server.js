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

const port = 4500;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
