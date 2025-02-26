const express = require("express");
const projectService = require("../project/service");
const errorService = require("../error/service");
const attributeService = require("./service");

const router = express.Router({ mergeParams: true }); //mergeParams to access parent router's parameters
router.post("/create", createAttribute);
router.put("/update/:attributeId", updateAttribute);
router.get("/list", getAttributeList);
router.get("/:attributeId", getAttribute);
router.delete("/delete/:attributeId", deleteAttribute);
module.exports = router;

async function deleteAttribute(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const attributeId = req.params.attributeId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            await attributeService.deleteAttribute(projectId, attributeId);
            res.status(200).json({ message: "Deleted attribute." });
        } else {
            throw errorService.newError("No Access or resource not existing", 401);
        }
    } catch (e) {
        next(e);
    }
}

async function getAttribute(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const attributeId = req.params.attributeId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            const attribute = await attributeService.getAttribute(projectId, attributeId);
            res.status(200).json(attribute);
        } else {
            throw errorService.newError("No Access or resource not existing", 401);
        }
    } catch (e) {
        next(e);
    }
}

async function createAttribute(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.userData.userId;
        const attributeName = req.body.attributeName;
        const attributeDescription = req.body.attributeDescription;
        const attributeDataType = req.body.attributeDataType;
        const attributeValue = req.body.attributeValue;

        if (await projectService.hasAccess(userId, projectId)) {
            const attributeId = await attributeService.createAttribute({
                projectId,
                attributeName,
                attributeDescription,
                attributeDataType,
                attributeValue
            });
            res.status(200).json({ message: "Created attribute.", id: attributeId });
        }
        else { throw errorService.newError("No Access or resource not existing", 401) }

    }
    catch (e) { next(e) }
}

async function updateAttribute(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const attributeId = req.params.attributeId;
        const userId = req.userData.userId;
        const attributeName = req.body.attributeName;
        const attributeDescription = req.body.attributeDescription;
        const attributeDataType = req.body.attributeDataType;
        const attributeValue = req.body.attributeValue;

        if (await projectService.hasAccess(userId, projectId)) {
            await attributeService.updateAttribute({
                projectId,
                attributeId,
                attributeName,
                attributeDescription,
                attributeDataType,
                attributeValue
            });
            res.status(200).json({ message: "Updated attribute." });
        }
        else { throw errorService.newError("No Access or resource not existing", 401) }

    }
    catch (e) { next(e) }
}


async function getAttributeList(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            const attributes = await attributeService.getAttributeList(projectId);
            res.status(200).json(attributes);
        }
        else { throw errorService.newError("No Access or resource not existing", 401) }

    }
    catch (e) { next(e) }
}

