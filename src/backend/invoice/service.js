const dbService = require('./../database/service')

module.exports.assignInvoice = async function (projectId,invoiceId) {
    const queryCmd = `UPDATE timesnippets SET invoice = '${invoiceId}' WHERE invoice = '0' AND id IN (SELECT timesnippetid FROM projects_timesnippets WHERE projectid='${projectId}');`;
    await dbService.query(queryCmd);
}

module.exports.createInvoice = async function (timestamp) {
    const queryCmd = `INSERT INTO invoices (date) VALUES ('${timestamp}')`;
    const response = await dbService.query(queryCmd);
    return response.insertId;
}

module.exports.getTimeSnippetsByInvoice = async function (invoiceId) {
    const queryCmd = `SELECT * FROM timesnippets WHERE invoice = '${invoiceId}' ORDER BY start DESC`;
    let timeSnippetData = await dbService.query(queryCmd);
    return timeSnippetData;
}