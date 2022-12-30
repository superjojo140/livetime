const dbService = require('./../database/service')

module.exports.hasAccess = async function (userId, timeSnippetId) {
    const queryCmd = `SELECT * FROM projects_timesnippets WHERE timesnippetid='${timeSnippetId}' AND projectid IN (SELECT projectid FROM projects_users WHERE userid='${userId}')`;
    let result = await dbService.query(queryCmd);
    if (result.length > 0) { return true; }
    return false;
}

module.exports.addToProject = async function (projectId, timeSnippetId) {
    const queryCmd = `INSERT INTO projects_timesnippets (timesnippetid, projectid) VALUES ('${timeSnippetId}', '${projectId}')`;
    await dbService.query(queryCmd);
}

module.exports.removeFromAllProjects = async function (timeSnippetId) {
    const queryCmd = `DELETE FROM projects_timesnippets WHERE timesnippetid = '${timeSnippetId}'`;
    await dbService.query(queryCmd);
}

module.exports.getTimeSnippet = async function (timeSnippetId) {
    const queryCmd = `SELECT * FROM timesnippets WHERE id='${timeSnippetId}'`;
    let timeSnippetData = await dbService.query(queryCmd);
    return timeSnippetData[0];
}

module.exports.getAllTimeSnippets = async function (projectId) {
    const queryCmd = `SELECT * FROM timesnippets WHERE invoice = '0' AND id IN (SELECT timesnippetid FROM projects_timesnippets WHERE projectid='${projectId}') ORDER BY start DESC`;
    let timeSnippetData = await dbService.query(queryCmd);
    return timeSnippetData;
}

module.exports.createTimeSnippet = async function (title, description, start, end) {
    const endValue = (end == null) ? `NULL` : `'${end}'`; //Special case for null
    const queryCmd = `INSERT INTO timesnippets (title, description, start, end) VALUES ('${title}', '${description}', '${start}', ${endValue})`;
    const response = await dbService.query(queryCmd);
    return response.insertId;
}

module.exports.updateTimeSnippet = async function (timeSnippetId, title, description, start, end) {
    const endValue = (end == null) ? `NULL` : `'${end}'`; //Special case for null
    const queryCmd = `Update timesnippets SET title = '${title}', description = '${description}' , start = '${start}', end = ${endValue} WHERE id = '${timeSnippetId}'`;
    await dbService.query(queryCmd);
}

module.exports.deleteTimeSnippet = async function (timeSnippetId) {
    const queryCmd = `DELETE FROM timesnippets WHERE id = '${timeSnippetId}'`;
    await dbService.query(queryCmd);
}