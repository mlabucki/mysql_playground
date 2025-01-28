require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = 3001;

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
//query for tutor + details
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
  const query = "SELECT first_name, last_name, city FROM student";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error student :", err);
      res.status(500).send("Error student data");
      return;
    }

    res.render("table", {
      title: "Students Page",
      tableTitle: "Our Student's List",
      records: results,
    });
  });
});

//our offer
app.get("/offer", (req, res) => {
  const query =
    "SELECT s.subject_name, t.first_name, t.last_name FROM subject AS s INNER JOIN tutor AS t ON s.tutor_id = t.tutor_id;";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error student :", err);
      res.status(500).send("Error student data");
      return;
    }

    res.render("table", {
      title: "Our Course's",
      tableTitle: "Our Offers's List",
      records: results,
    });
  });
});

//avg
app.get("/best_students", (req, res) => {
  const query =
    "SELECT st.first_name, st.last_name, ROUND(AVG(sc.mark),2) AS avg_mark FROM scoreboard AS sc INNER JOIN student AS st ON sc.student_id = st.id WHERE sc.semester = 'Fall' AND sc.year = 2024 GROUP BY sc.student_id;";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error student :", err);
      res.status(500).send("Error student data");
      return;
    }

    res.render("table", {
      title: "Student's Rank",
      tableTitle: "Our Offers's Results Fall 2024",
      records: results,
    });
  });
});

//subject with avg above 60%
app.get("/subjects_results", (req, res) => {
  const query =
    "SELECT s.subject_name, ROUND(AVG(sc.mark),2) AS average_mark, t.first_name AS tutor_name, t.last_name AS tutor_last_name FROM scoreboard AS sc INNER JOIN subject AS s ON s.subject_id = sc.subject_id INNER JOIN tutor AS t ON t.tutor_id = sc.tutor_id GROUP BY sc.subject_id, s.subject_name, t.first_name, t.last_name HAVING AVG(sc.mark) > 60;";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error student :", err);
      res.status(500).send("Error student data");
      return;
    }

    res.render("table", {
      title: "Best Results",
      tableTitle: "Results of our subjects",
      records: results,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
