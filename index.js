const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const server = express();



// Heroku server use, allows others to access your heroku backend, else you will receive a CORS error when a Front
// End dev tries to pull anything from your DB
// server.use(function(req,res,next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Origin", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();

// });

const softserver = require('./api/server')

server.use(softserver);

server.use(helmet());
server.use(cors());
server.use(express.json());

const port = process.env.PORT || 3800;

server.listen(port, () => {
   console.log(`port working${port}`);
})