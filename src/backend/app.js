//Import npm modules
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

//Import own modules
const authMiddleware = require("./auth/middleware");
const projectController = require("./project/controller");

//Init app
dotenv.config();
const app = express();
const port = Number(process.env.PORT);

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authMiddleware); //Use Auth middleware allways
app.use(express.static('public')); //Serve static files

//Register routes and controller
app.use("/projects", projectController);

//Start server
app.listen(port, function () {
    console.info(`LiveTime Server started and listening on http://localhost:${port}`);
});