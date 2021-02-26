//Import npm modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");

//Import own modules
const authMiddleware = require("./auth/middleware");
const errorMiddleware = require("./error/middleware");
const projectController = require("./project/controller");

//Init app
const app = express();

//Serve static files
app.use(express.static('public'));

//Middleware
app.use(bodyParser.json());
app.use(authMiddleware); //Use Auth middleware for all  following API routes

//Register routes and controller
app.use("/projects", projectController);

//Error handler
app.use(errorMiddleware.notFoundRoute);
app.use(errorMiddleware.errorHandler);

//Start server
const port = Number(process.env.PORT);
app.listen(port, function () {
    console.info(`LiveTime Server started and listening on http://localhost:${port}`);
});