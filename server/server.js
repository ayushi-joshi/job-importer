const express = require("express");
const { createServer } = require("http");
require("dotenv").config();
//const path = require('path');

//const configureCors = require("./src/config/corsConfig.js");
const routes = require("./src/routes/index.js");


// Database Connection
const DBConnection = require("./src/config/db_config");

const app = express();

const server = createServer(app);

const port = process.env.PORT || 8080;
// Apply CORS middleware
//app.use(configureCors());

// Use cookie-parser to parse cookies
//app.use(cookieParser());

// Use helmet to secure Express apps by setting various HTTP headers
//app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));
 //app.use('/public', express.static(path.join(__dirname, 'public')));

// default route
// app.get("/", (req, res) => {
//   //res.status(200).json("Api working fine!");
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// io.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
    
//      io.emit('chat message', msg);
//   });
// });
 app.use("/api", routes);

DBConnection()

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
