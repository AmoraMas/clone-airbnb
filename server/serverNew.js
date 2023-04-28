/** @format */

// define dependencies
import express from "express";
import { createClient } from "redis";

//const cors = require("cors");
const server = express();
const port = process.env.PORT || 5172; // Port that Express listens to for requests

server.use(express.json());

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// define structure for accessing database
//const { Pool } = require('pg');
import getPool from "./connDB.js";
const sql = getPool();

// define redis info
const redisClient = createClient({ socket: { port: 6379, host: "redis" } });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();
const redisExpiration = 300; // 300 seconds or 5 minutes

// listen to the port
server.listen(port, function () {
  console.log(`Server is listening on port ${port}.`);
});

// Function to run in order to return data if it exists in Redis
// Or get data from DB, save it to Redis, and return the DB data
async function getData(queryString, redisString) {
  let results = redisClient.get(redisString, async (error, result) => {
    if (error) {
      console.error(error);
    }
  });
  results = await results;
  if (results != null) {
    return JSON.parse(results);
  } else {
    results = await new Promise((resolve, reject) =>
      sql.query(queryString, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      })
    );
    let response = await results;
    redisClient.setEx(redisString, redisExpiration, JSON.stringify(response));
    return results;
  }
}

//
// here is where all of your requests with routes go
//

server.get("/language", async (req, res) => {
  const response = await getData(`SELECT * FROM language`, "language");
  res.json(response);
});

server.get("/currency", async (req, res) => {
  const response = await getData(`SELECT * FROM currency`, "currency");
  res.json(response);
});

server.get("/amenities", async (req, res) => {
  const response = await getData(`SELECT * FROM amenities`, "amenities");
  res.json(response);
});

server.get("/users", async (req, res) => {
  const response = await getData(`SELECT * FROM users`, "users");
  res.json(response);
});

server.get("/properties", async (req, res) => {
  const response = await getData(`SELECT * FROM properties`, "properties");
  res.json(response);
});

server.get("/user_properties", async (req, res) => {
  const response = await getData(
    `SELECT * FROM user_properties`,
    "user_properties"
  );
  res.json(response);
});

server.get("/propertyImages", async (req, res) => {
  const response = await getData(
    `SELECT * FROM propertyimages`,
    "propertyimages"
  );
  res.json(response);
});

server.get("/reviews", async (req, res) => {
  const response = await getData(`SELECT * FROM reviews`, "reviews");
  res.json(response);
});

server.get("/properties/:id/reviews", async (req, res, next) => {
  const { id } = req.params;
  const query = `
  SELECT r.*, u.avatar, u.firstname, u.lastname
  FROM reviews r
  JOIN users u ON r.userid = u.userid
  WHERE r.propertyid = ${id}
  `;
  const response = await getData(query, `reviewsbyid${id}`);
  res.json(response);
});

server.post("/reviews", function (req, res, next) {
  const requiredKeys = ["propertyid", "review", "rating", "userid"];
  if (requiredKeys.every((key) => req.body.hasOwnProperty(key))) {
    const result = sql.query(
      `INSERT INTO reviews(propertyid, review, rating, userid) VALUES (${req.body.propertyid}, ${req.body.review}, ${req.body.rating}, ${req.body.userid}) RETURNING *;`,
      (err, result, next) => {
        if (result) res.status(201);
        res.json(result[0]);
      }
    );
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
