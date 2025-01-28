require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout/layout");

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

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
  res.render("home", {
    title: "Home Page",
  });
});
//query for average notes + render(table)
app.get("/tutor", (req, res) => {
  const query = "SELECT * FROM tutor";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error tutor:", err);
      res.status(500).send("Error fetching tutor data");
      return;
    }
    res.render("tutor", {
      title: "Tuto Page",
      data: results,
    });
  });
});

app.get("/table/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const query = `SELECT * FROM ${tableName}`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(`Error ${tableName}:`, err);
      res.status(500).send("Error fetching table");
      return;
    }
    res.render("table", {
      tableTitle: `${tableName.charAt(0) + tableName.slice(1)} Table`,
      records: result,
    });
  });
});

//crate queries for students data
app.get("/student", (req, res) => {
  const query = "SELECT * FROM student";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error student :", err);
      res.status(500).send("Error student data");
      return;
    }

    res.render("table", {
      title: "Students Page",
      tableTitle: "Students Page",
      records: results,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
