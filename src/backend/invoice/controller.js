const express = require("express");
const errorService = require("./../error/service");
const invoiceService = require("./service");

const router = express.Router({ mergeParams: true }); //mergeParams to access parent router's parameters
router.post("/create", createInvoice);
router.get("/:invoiceId", getInvoiceSnippets);
module.exports = router;

async function createInvoice(req, res, next) {
    try {
        const projectId = req.params.projectId;

        let timestamp = new Date().toISOString();
        timestamp = timestamp.substring(0, timestamp.length - 1);
        let invoiceId = await invoiceService.createInvoice(timestamp);
        await invoiceService.assignInvoice(projectId, invoiceId);
        res.status(200).json({ message: "Created invoice.", id: invoiceId });
    }
    catch (e) { next(e) }
}

async function getInvoiceSnippets(req, res, next) {
    try {
        const invoiceId = req.params.invoiceId;
        const snippets = await invoiceService.getTimeSnippetsByInvoice(invoiceId);
        res.status(200).json(snippets);
    }
    catch (e) { next(e) }
}