const express = require("express");
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

        let timestamp = new Date().toISOString();
        timestamp = timestamp.substring(0, timestamp.length - 1);

        await invoiceService.createInvoice(invoiceId,timestamp,projectId);
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

async function getInvoiceList(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const invoices = await invoiceService.getInvoiceList(projectId);
        res.status(200).json(invoices);
    }
    catch (e) { next(e) }
}

async function getNotAssignedSnippetInfo(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const invoices = await invoiceService.getNotAssignedSnippetInfo(projectId);
        res.status(200).json(invoices);
    }
    catch (e) { next(e) }
}