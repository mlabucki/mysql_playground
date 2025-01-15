const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database");
});

app.get("/", (req, res) => {
  res.send(`
      <div>
          <form>
              <input placeholder="email" />
              <input placeholder="password" />
              <input placeholder="password confirmation" />
          </form>
      </div>
      `);
});

app.get("/data", (req, res) => {
  const query = "SELECT * FROM course"; // Replace with your table
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
