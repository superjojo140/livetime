const express = require("express");
const timeSnippetController = require("./../timesnippet/controller");
const invoiceController = require("./../invoice/controller");
const projectService = require("./service");
const errorService = require("./../error/service");

const router = express.Router();
//Use timesnippetController if neccessary
router.use("/:projectId/timesnippets", timeSnippetController);
router.use("/:projectId/invoices", invoiceController);
//Register own routes
router.get("/", getAllProjects);
router.get("/:projectId", getProject);
router.post("/", createProject);
router.put("/:projectId", updateProject)
router.delete("/:projectId", deleteProject);
module.exports = router;

async function getAllProjects(req, res, next) {
    try {
        const userId = req.userData.userId;
        let projects = await projectService.getAllProjects(userId);
        res.status(200).json(projects);
    }
    catch (e) { next(e) }
}

async function getProject(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            let projectData = await projectService.getProject(projectId);
            res.status(200).json(projectData);
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}


async function createProject(req, res, next) {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const notes = req.body.notes;
        const userId = req.userData.userId;

        const projectId = await projectService.createProject(title, description, notes);
        await projectService.addAccess(userId, projectId);
        res.status(201).json({ projectId: projectId });
    }
    catch (e) { next(e) }
}


async function updateProject(req, res, next) {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const notes = req.body.notes;
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            await projectService.updateProject(projectId, title, description, notes);
            res.status(204).send();
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}


async function deleteProject(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            await projectService.removeAccessForEveryone(projectId);
            await projectService.deleteProject(projectId);
            res.status(204).send();
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}