require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const secret = require("./secrets");

const server = express();
var bodyParser = require("body-parser");

server.use(helmet()); // hides your tech stack from sniffers
server.use(express.json()); // built-in
server.use(morgan("dev")); // logging middleware for console
server.use(cors()); // allows domains/ports to connect to your server

const db = require("../database/dbConfig");

const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

server.get("/", (req, res) => {
  res.status(201).json("just a test");
});

//----------------------------------------------------

server.post("/register", (req, res) => {
  let userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 12);
  userInfo.password = hash;

  addUserPerson(userInfo)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(501).json({ message: `Registration Error!!!${error}` });
    });
  console.log(userInfo.username);
  console.log(userInfo.password);
});

async function addUserPerson(user) {
  const paul = await db("users").insert(user);

  return `New Person Added: ${user.username}`;
}

//---------------------------------------------------

function token(person) {
  console.log("getting a token is starting");
  const payload = {
    subject: person.id,
    username: person.username
  };
  const options = {
    expiresIn: "1d"
  };
  console.log("we got the token");

  return jwt.sign(payload, secret.jwtSecret, options);
}

function searchy(x) {
  return db("users").where(x);
}

server.post("/login", (req, res) => {
  let usernamo = req.body.username;
  let passwordo = req.body.password;

  searchy({ username: usernamo })
    .first()
    .then(user => {
      if (bcrypt.compareSync(passwordo, user.password)) {
        let tokenThing = token(user);

        res
          .status(202)
          .json({ message: `Welcome ${user.username} !`, tokenThing });
      } else {
        res.status(402).json({ message: "Invalid info given" });
      }
    })
    .catch(error => {
      res.status(501).json({
        message: "there is a problum"
      });
    });
});

//---------------------------------------------

// just a test to see if users are actually logged in and authenticated
server.get("/test", authenticate2, (rec, rez) => {
  usersRegis()
    .then(go => {
      rez.send(go);
    })
    .catch(err => {
      rez.send(err);
    });
});

function usersRegis() {
  return db("users").select("username", "password");
}

//-----------------------------------------------

function authenticate2(req, res, next) {
  const token = req.get("Authorization");

  if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(402).json(err);
      } else {
        req.decoded = decoded;

        next();
      }
    });
  } else {
    return res.status(403).json({
      error: "No Token Provided, must be in Authorization header on request"
    });
  }
}

//-----------------------------------------------

server.get("/guests", (req, res) => {
  console.log("starting to get guests");
  blah()
    .then(guest => {
      res.status(200).json(guest);
    })
    .catch(err => {
      res.status(500).json({ error: "The guest could not be retrieved." });
    });
});

function blah() {
  console.log("totes gonna find an guest");
  return db("guests").select(
    "id",
    "name",
    "email",
    "phone_number",
    "number_of_guest",
    "number_of_rooms",
    "dates_staying"
  );
}

//-----------------------------------------------

server.post("/addguest", authenticate2, (req, res) => {
  console.log("we gonna try to add an guest");
  let post = req.body;

  addPost(post)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(503).json({ message: "Something is wrong... somewhere..." });
    });
});

async function addPost(post) {
  console.log("before");
  const sally = await db("guests").insert(post);
  console.log("after");
  return `New Post ID: ${post.guestname} : Added :)`;
}

//-----------------------------------------------

server.delete("/deleteguest/:id", authenticate2, (rec, rez) => {
  let thingtodie = rec.params.id;

  db("guests")
    .where({ id: thingtodie })
    .del()
    .then(itsdead => {
      if (!itsdead) {
        rez.send("Nope... that does not exist...");
      } else {
        rez
          .status(402)
          .json({ message: "Yup, you killed it. It is not here anymore!" });
      }
    })
    .catch(errorz => {
      rez
        .status(501)
        .json({ message: "Failed.  You tried... and failed miserably..." });
    });
});

//-----------------------------------------------

server.put("/updateguest/:id", authenticate2, (reck, rez) => {
  let updoot = reck.params.id;

  db("guests")
    .where({ id: updoot })
    .update(reck.body)
    .then(newlook => {
      if (newlook > 0) {
        db("guests")
          .where({ id: reck.params.id })
          .then(things => {
            rez.status(201).json({ message: "you have successfully updooted" });
          });
      } else {
        rez.status(403).json({ message: "failed to update stuff..." });
      }
    })
    .catch(errorz => {
      rez.status(501).json(errorz);
    });
});

//-----------------------------------------------

module.exports = server;