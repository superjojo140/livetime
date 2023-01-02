const express = require("express");
const projectService = require("../project/service");
const errorService = require("./../error/service");
const invoiceService = require("./service");

const router = express.Router({ mergeParams: true }); //mergeParams to access parent router's parameters
router.post("/create", createInvoice);
router.get("/list", getInvoiceList);
router.get("/unassigned", getNotAssignedSnippetInfo);
router.get("/:invoiceId", getInvoiceSnippets);
module.exports = router;

async function createInvoice(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const invoiceId = req.body.invoiceId;
        const userId = req.userData.userId;
        let timestamp = req.body.timestamp;

        if (await projectService.hasAccess(userId, projectId)) {
            timestamp = timestamp.substring(0, timestamp.length - 1);
            await invoiceService.createInvoice(invoiceId, timestamp, projectId);
            await invoiceService.assignInvoice(projectId, invoiceId);
            res.status(200).json({ message: "Created invoice.", id: invoiceId });
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }

    }
    catch (e) { next(e) }
}

async function getInvoiceSnippets(req, res, next) {
    try {
        const invoiceId = req.params.invoiceId;
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            const snippets = await invoiceService.getTimeSnippetsByInvoice(invoiceId);
            res.status(200).json(snippets);
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }

    }
    catch (e) { next(e) }
}

async function getInvoiceList(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            const invoices = await invoiceService.getInvoiceList(projectId);
            res.status(200).json(invoices);
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }

    }
    catch (e) { next(e) }
}

async function getNotAssignedSnippetInfo(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const userId = req.userData.userId;

        if (await projectService.hasAccess(userId, projectId)) {
            const invoices = await invoiceService.getNotAssignedSnippetInfo(projectId);
            res.status(200).json(invoices);
        }
        else { throw errorService.newError("No Access or ressource not existing", 401) }
    }
    catch (e) { next(e) }
}