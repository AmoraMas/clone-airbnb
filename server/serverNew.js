// define dependencies
import express  from "express";
//const cors = require("cors");
const server = express();
const port = process.env.PORT || 5172; // Port that Express listens to for requests

server.use(express.json());

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

// define structure for accessing database
//const { Pool } = require('pg');
import getPool from "./connDB.js";
const sql = getPool();

// listen to the port
server.listen(port, function () {
  console.log(`Server is listening on port ${port}.`);
});

//
// here is where all of your requests with routes go
//

// test request to verify this file is working
server.get("/test", (req, res) => {
    console.log('Responded to test request.');
      res.json('You have reached the server routing page');
  });
  
  server.get("/language", (req, res) => {
    const result = sql.query(`SELECT * FROM language`, (err, result) => {
      res.json(result.rows);
    });
  });
  
  server.get("/currency", (req, res) => {
    const result = sql.query(`SELECT * FROM currency;`, (err, result) => {
      res.json(result.rows);
    });
  });
  
  server.get("/amenities", (req, res) => {
    const result = sql.query(`SELECT * FROM amenities`, (err, result) => {
      res.json(result.rows);
    });
  });
  
  server.get("/users", (req, res) => {
      const result = sql.query(`SELECT * FROM users`, (err, result) => {
        res.json(result.rows);
      });
    });
  
    server.get("/properties", (req, res) => {
      const result = sql.query(`SELECT * FROM properties`, (err, result) => {
        res.json(result.rows);
      });
    });
  
    server.get("/user_properties", (req, res) => {
      const result = sql.query(`SELECT * FROM user_properties`, (err, result) => {
        res.json(result.rows);
      });
    });
  
    server.get("/propertyImages", (req, res) => {
      const result = sql.query(`SELECT * FROM propertyImages`, (err, result) => {
        res.json(result.rows);
      });
    });
  
    server.get("/reviews", (req, res) => {
      const result = sql.query(`SELECT * FROM reviews`, (err, result) => {
        res.json(result.rows);
      });
    });
  
    server.get("/properties/:id/reviews", (req, res, next) => {
      const { id } = req.params;
      const result = sql.query(`
        SELECT r.*, u.avatar, u.firstname, u.lastname
        FROM reviews r
        JOIN users u ON r.userid = u.userid
        WHERE r.propertyid = ${id}
      `
        , (err, result)  => {
          res.json(result.rows);
        })
     });
  
    server.post("/reviews", function (req, res, next) {
      const requiredKeys = ["propertyid", "review", "rating", "userid"];
      if (
        requiredKeys.every((key) => req.body.hasOwnProperty(key))
      ) {
        const result = sql.query(`INSERT INTO reviews(propertyid, review, rating, userid) VALUES (${req.body.propertyid}, ${req.body.review}, ${req.body.rating}, ${req.body.userid}) RETURNING *;`,
        (err, result, next) => {
          if (result)
            res.status(201);
            res.json(result[0]);
          })
      } else {
        res.status(400).send("Bad Request");
        console.log(req.body);
      }
    });
  
    server.use((req, res, next) => {
      res.contentType("text/plain").status(404).send("Not Found");
    });
    
    server.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });