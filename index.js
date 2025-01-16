const express = require("express");
const mysql = require("mysql");
const path = require("path");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/tutor", (req, res) => {
  res.render("tutor");
});

app.get("/student", (req, res) => {
  /* list of students and courses related to them with possibility to filter by Academical year */
  const query =
    "select course.Name, student.Name, course.Academical_year from course, student where Academical_year = '2024'";
  // Replace with your table
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.render("student", { students: results });
  });
});

app.get("/tutor", (req, res) => {
  /* Posibility to filter students and courses */
  /*Authorization credential */
  const query = "select * from tutor";
  // Replace with your table
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.render("tutor", { tutor: results });
  });
});

app.get("/courses", (req, res) => {
  //list of courses //
  const query = "SELECT * FROM course";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.render("table", { courses: results });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
