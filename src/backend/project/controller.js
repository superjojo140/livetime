const express = require("express");
const projectService = require("./service");

const router = express.Router();
router.get("/", getAllProjects);
router.get("/:projectId", getProject);
router.post("/", createProject);
router.put("/:projectId", updateProject)
router.delete("/:projectId", deleteProject);
module.exports = router;

function getAllProjects(req, res, next) {
    try {
        res.status(200).json({
            message: "getAllProjects"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}

function getProject(req, res, next) {
    try {
        res.status(200).json({
            message: "getProject"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}


function createProject(req, res, next) {
    try {
        res.status(200).json({
            message: "createProject"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}


function updateProject(req, res, next) {
    try {
        res.status(200).json({
            message: "updateProject"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}


function deleteProject(req, res, next) {
    try {
        res.status(200).json({
            message: "deleteProject"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}