const express = require("express");
const timeSnippetService = require("./service");
const projectService = require("./../project/service")
const errorService = require("./../error/service");

const router = express.Router({ mergeParams: true }); //mergeParams to access parent router's parameters
router.get("/", getAllTimeSnippets);
router.get("/:timeSnippetId", getTimeSnippet);
router.post("/", createTimeSnippet);
router.put("/:timeSnippetId", updateTimeSnippet)
router.delete("/:timeSnippetId", deleteTimeSnippet);
module.exports = router;

async function getAllTimeSnippets(req, res, next) {
    try {
        const userId = req.userData.userId;
        const projectId = req.params.projectId;

        if (await projectService.hasAccess(userId, projectId)) {
            let timeSnippets = await timeSnippetService.getAllTimeSnippets(projectId);
            res.status(200).json(timeSnippets);
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}

async function getTimeSnippet(req, res, next) {
    try {
        const timeSnippetId = req.params.timeSnippetId;
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId) && await timeSnippetService.hasAccess(userId, timeSnippetId)) {
            let timeSnippetData = await timeSnippetService.getTimeSnippet(timeSnippetId);
            res.status(200).json(timeSnippetData);
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}


async function createTimeSnippet(req, res, next) {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const start = req.body.start;
        const end = req.body.end;
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            const timeSnippetId = await timeSnippetService.createTimeSnippet(title, description, start, end);
            await timeSnippetService.addToProject(projectId, timeSnippetId);
            res.status(201).json({ timeSnippetId: timeSnippetId });
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}


async function updateTimeSnippet(req, res, next) {
    try {
        const timeSnippetId = req.params.timeSnippetId;
        const title = req.body.title;
        const description = req.body.description;
        const start = req.body.start;
        const end = req.body.end;
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId) && await timeSnippetService.hasAccess(userId, timeSnippetId)) {
            await timeSnippetService.updateTimeSnippet(timeSnippetId, title, description, start, end);
            res.status(204).send();
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}


async function deleteTimeSnippet(req, res, next) {
    try {
        const timeSnippetId = req.params.timeSnippetId;
        const userId = req.userData.userId;
        const projectId = req.params.projectId;

        if (await projectService.hasAccess(userId, projectId) && await timeSnippetService.hasAccess(userId, timeSnippetId)) {
            await timeSnippetService.removeFromAllProjects(timeSnippetId);
            await timeSnippetService.deleteTimeSnippet(timeSnippetId);
            res.status(204).send();
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}