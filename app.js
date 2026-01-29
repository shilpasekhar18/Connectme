const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const mysql = require("mysql");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fs = require("fs");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "connectme",
});

const port = 3000;

app.use(
  session({
    secret: "e240cb53fc40db7e259ad5990a2c28d5b5705a50ba8d516145cbb9bac3a04973",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
const multer = require("multer");
const { error } = require("console");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "cert")); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const userId = req.session.userid;
    const serviceName = req.session.serviceName;
    const originalname = file.originalname;

    const newFilename = `userid_${userId}_sid_${serviceName}_${originalname}`; // Prepend USERID_ to original filename
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });
app.use(upload.single("fileUpload"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/auth", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    // Execute SQL query to check if the account exists
    connection.query(
      "SELECT * FROM accounts WHERE BINARY name = ?",
      [username],
      function (error, results, fields) {
        if (error) {
          console.log(error);
          response.status(500).json({
            success: false,
            message: "Database error occurred",
            error: error,
          });
          return;
        }

        // If the account exists
        if (results.length > 0) {
          // Execute another SQL query to verify the password
          connection.query(
            "SELECT * FROM accounts WHERE BINARY name = ? AND BINARY password = ?",
            [username, password],
            function (error, results, fields) {
              if (error) {
                console.log(error);
                response.status(500).json({
                  success: false,
                  message: "Database error occurred",
                  error: error,
                });
                return;
              }

              // If the password matches
              if (results.length > 0) {
                // Set session variables and send success response
                request.session.loggedin = true;
                request.session.username = username;
                request.session.userid = results[0].id;
                response.send({ success: true });
              } else {
                // If password doesn't match, send authentication failure
                // response
                response.status(401).json({
                  success: false,
                  message: "Incorrect password.",
                });
              }
              response.end(); // Ensure response is sent after all database
              // operations
            }
          );
        } else {
          // If account doesn't exist, send authentication failure response
          response.status(401).json({
            success: false,
            message: "Account does not exist.",
          });
          response.end(); // Ensure response is sent after all database
          // operations
        }
      }
    );
  } else {
    // If username or password is missing, send appropriate response
    response.status(400).json({
      success: false,
      message: "Please enter Username and Password!",
    });
    response.end(); // Ensure response is sent after all database operations
  }
});

// http://localhost:3000/register
app.post("/register", function (request, response) {
  let username = request.body.username;
  let email = request.body.email;
  let password = request.body.password;

  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE BINARY name = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          response.status(401).json({
            success: false,
            message: "User already exists",
          });
        } else {
          // code for insertion
          connection.query(
            "INSERT INTO accounts (name, password, email) VALUES (?, ?, ?)",
            [username, password, email],
            function (error, results, fields) {
              if (error) {
                response.status(500).json({
                  success: false,
                  message: "Error inserting into accounts",
                  error: error,
                });
                return;
              }

              // Code for successful insertion
              response.json({ success: true });
            }
          );
        }
      }
    );
  }
});

app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.redirect("/option");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});

app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/login.css");
});
app.get("/profile", (req, res) => {
  if (req.session.loggedin) {
    res.render(__dirname + "/profile");
  } else {
    res.redirect("/");
  }
});

app.get("/myServices", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "select A.* , B.sname from employee A , services B where A.sid=B.sid and  userid=?",
      [req.session.userid],
      (error, results, fields) => {
        if (error) {
          console.error("Error fetching my services: ", error);
          res.sendStatus(500);
        }
        res.render(__dirname + "/myservices", { data: results });
      }
    );
  } else {
    res.redirect("/");
  }
});

app.post("/removeService", (req, res) => {
  id = req.body.id;
  connection.query(
    "SELECT image from employee where id=?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error fetching image location");
      }
      const imagePath = path.join(__dirname, "public", results[0].image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
      connection.query(
        "DELETE FROM booking WHERE employee=?",
        [id],
        (error, results, fields) => {
          if (error) {
            console.error("Error deleting bookings: ", error);
            res.sendStatus(500);
          }
          connection.query(
            "DELETE FROM employee where id=?",
            [id],
            (error, results, fields) => {
              if (error) {
                console.error("Error deleting service: ", error);
              }
              res.sendStatus(200);
            }
          );
        }
      );
    }
  );
});

app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});
app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});
app.post("/userlist", (req, res) => {
  connection.query(
    "select * from services where sname=? and oid=?",
    [req.body.service, req.session.service.id],
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        req.session.serviceName = results[0].sid;
        req.session.selectedDate = req.body.date;
      } else {
        req.session.serviceName = 0;
      }
      res.sendStatus(200);
    }
  );
});
app.get("/userlist", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT e.id, e.name, e.phone, e.email, e.wage, e.image, e.sid, e.description, e.hours, e.age, e.userid, e.location,e.image, COUNT(b.bid) AS jobs FROM employee e LEFT JOIN booking b ON e.id = b.employee AND b.date = ? WHERE e.sid = ? AND e.userid != ? GROUP BY e.id ORDER BY e.id;",
      [req.session.selectedDate, req.session.serviceName, req.session.userid],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.render(__dirname + "/userlist", {
            data: results,
          });
        } else {
          // res.send("error in database");
          res.render(__dirname + "/userlist", {
            data: results,
          });
        }
        res.end();
      }
    );
  } else {
    res.redirect("/");
  }
});

app.get("/option", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT * FROM options",
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.render(__dirname + "/option", {
            data: results,
          });
        } else {
          res.send("error in database");
        }
        res.end();
      }
    );
  } else {
    res.redirect("/");
  }
});

app.post("/option", (req, res) => {
  req.session.service = req.body;
  res.redirect("/outdoor");
});

app.get("/outdoor", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT * FROM services AS s, options AS o WHERE o.id = s.oid and o.id=?",
      [req.session.service.id],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.render(__dirname + "/outdoor", {
            data: results,
          });
        } else {
          res.send("error in database");
        }
        res.end();
      }
    );
  } else {
    res.redirect("/");
  }
});

app.post("/addservice", (req, res) => {
  var name = req.body.name;
  var hour = req.body.hour;
  var age = req.body.age;
  var phone = req.body.phone;
  var email = req.body.email;
  var description = req.body.desc;
  var salary = req.body.salary;
  var location = req.body.location;
  var eid = 0;
  var imagePath = req.file ? path.join("/cert", req.file.filename) : "";
  if (name == undefined && hour == undefined && age == undefined) {
    connection.query(
      "select * from employee where userid=?",
      [req.session.userid],
      (error, results, fields) => {
        if (error) throw error;
        eid = results[0].id;
        if (results.insertId > 0) {
          res.sendStatus(200);
        } else {
          res.sendStatus(403);
        }
      }
    );
  } else {
    connection.query(
      "INSERT INTO employee (name, phone, email, wage, description, hours, age, sid ,userid, location, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        phone,
        email,
        salary,
        description,
        hour,
        age,
        req.session.serviceName,
        req.session.userid,
        location,
        imagePath,
      ],
      (error, results, fields) => {
        if (error) throw error;
        if (results.insertId > 0) {
          res.sendStatus(200);
        } else {
          res.sendStatus(403);
        }
      }
    );
  }
});

app.get("/addservice", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "select * from employee where userid=? and sid=?",
      [req.session.userid, req.session.serviceName],
      (error, results, fields) => {
        if (results.length > 0) {
          res.render(__dirname + "/addservice", {
            data: results,
          });
        } else {
          res.render(__dirname + "/addservice", {
            data: results,
          });
        }
      }
    );
  } else {
    res.redirect("/");
  }
});
app.get("/addsuc", (req, res) => {
  res.sendFile(__dirname + "/addsuc.html");
});
app.get("/book", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT employee, employer, sid FROM booking WHERE employer=? AND sid=? AND employee=?",
      [req.session.userid, req.session.serviceName, req.session.employee],
      (error, results, fields) => {
        if (results.length > 0) {
          req.session.serviceName = undefined;
          req.session.employee = undefined;
          res.render(__dirname + "/book", {
            data: results,
          });
        } else {
          res.render(__dirname + "/book", {
            data: results,
          });
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

app.post("/choice", (req, res) => {
  var id = req.body.id;
  req.session.employee = id;
  res.sendStatus(200);
});

app.post("/book", (req, res) => {
  var name = req.body.name;
  var address = req.body.address;
  var phone = req.body.phone;
  var eid = req.session.employee;
  connection.query(
    "INSERT INTO booking (employee,employer,sid,employer_name,employer_phone,employer_address,date) VALUES(?,?,?,?,?,?,?)",
    [
      eid,
      req.session.userid,
      req.session.serviceName,
      name,
      phone,
      address,
      req.session.selectedDate,
    ],
    (error, results, fields) => {
      if (error) throw error;
      req.session.selectedDate = undefined;
      res.sendStatus(200);
    }
  );
});

app.get("/booksuc", (req, res) => {
  res.sendFile(__dirname + "/booksuc.html");
});
app.use(express.static(path.join(__dirname, "")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/getJobs", (req, res) => {
  const sqlQuery = `
  SELECT A.bid as booking_id, A.employer AS employer_id, A.employer_name,A.employer_phone,A.cancel_status, B.wage,A.employer_address,S.sname,A.date FROM booking A  JOIN employee B ON A.employee = B.id  JOIN services S ON A.sid = S.sid where B.userid =?`;
  // Execute the query with the logged in user's name from the session
  connection.query(sqlQuery, [req.session.userid], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Send the results as JSON
    res.json(results);
  });
});

app.get("/getBooking", (req, res) => {
  const sqlQuery = `
  SELECT A.bid, A.employee, A.sid, B.name, B.phone, C.sname ,B.wage,B.location as employee_address,A.cancel_status,A.date FROM booking A JOIN employee B ON A.employee = B.id JOIN services C ON A.sid = C.sid WHERE A.employer = ?;`;
  // Execute the query with the logged in user's name from the session
  connection.query(sqlQuery, [req.session.userid], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Send the results as JSON
    res.json(results);
  });
});

app.post("/removeBooking", (req, res) => {
  const bid = req.body.bid;
  connection.query(
    "SELECT cancel_status FROM booking WHERE bid = ?",
    [bid],
    (error, results, fields) => {
      if (error) {
        console.error("Error checking status:", error);
        res.sendStatus(500);
      } else {
        if (results[0].cancel_status == 0) {
          connection.query(
            "UPDATE booking set cancel_status = 1 where bid = ?",
            [bid],
            (error, results, fields) => {
              if (error) {
                console.error("Error updating cancel_status: ", error);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            }
          );
        } else {
          connection.query(
            "DELETE FROM booking WHERE bid = ?",
            [bid],
            (error, results, fields) => {
              if (error) {
                console.error("Error deleting booking:", error);
                res.sendStatus(500); // Internal server error
              } else {
                res.sendStatus(200); // OK
              }
            }
          );
        }
      }
    }
  );
});

app.post("/cert", (req, res) => {
  req.session.imagesrc = req.body.imagesrc;
  res.sendStatus(200);
});

app.get("/cert", (req, res) => {
  imagePath = req.session.imagesrc;
  res.render(__dirname + "/cert", { imagePath });
});

app.get("/clearSession", (req, res) => {
  // Destroy the entire session
  req.session.destroy((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});
