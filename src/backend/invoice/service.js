const dbService = require('./../database/service')

module.exports.assignInvoice = async function (projectId, invoiceId) {
    const queryCmd = `UPDATE timesnippets SET invoice = '${invoiceId}' WHERE invoice = '0' AND id IN (SELECT timesnippetid FROM projects_timesnippets WHERE projectid='${projectId}');`;
    await dbService.query(queryCmd);
}

module.exports.createInvoice = async function (invoiceId, timestamp, projectId) {
    const queryCmd = `INSERT INTO invoices (id,date,projectId) VALUES ('${invoiceId}','${timestamp}','${projectId}')`;
    const response = await dbService.query(queryCmd);
    return response.insertId;
}

module.exports.getTimeSnippetsByInvoice = async function (invoiceId) {
    const queryCmd = `SELECT * FROM timesnippets WHERE invoice = '${invoiceId}' ORDER BY start DESC`;
    let timeSnippetData = await dbService.query(queryCmd);
    return timeSnippetData;
}

module.exports.getInvoiceList = async function (projectId) {
    const queryCmd = `SELECT * FROM invoices WHERE projectId = '${projectId}' ORDER BY date DESC`;
    let invoiceData = await dbService.query(queryCmd);

    for (let invoice of invoiceData) {
        const queryCmd = `SELECT start FROM timesnippets WHERE invoice = '${invoice.id}' ORDER BY start DESC LIMIT 1`;
        let result = await dbService.query(queryCmd);
        if (result[0]) {
            invoice.lastStart = result[0].start;
            const queryCmd2 = `SELECT start FROM timesnippets WHERE invoice = '${invoice.id}' ORDER BY start ASC LIMIT 1`;
            let result2 = await dbService.query(queryCmd2);
            invoice.firstStart = result2[0].start;
        }
    }

    return invoiceData;
}

module.exports.getNotAssignedSnippetInfo = async function (projectId) {
    const queryCmd = `SELECT * FROM timesnippets WHERE invoice = '0' AND id IN (SELECT timesnippetid FROM projects_timesnippets WHERE projectid = '${projectId}') ORDER BY start DESC`;
    let snippetData = await dbService.query(queryCmd);
    return snippetData;
}