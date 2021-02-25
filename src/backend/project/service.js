const dbService = require('./../database/service')

module.exports.hasAccess = async function (userId, projectId) {
    const queryCmd = `SELECT * FROM projects_users WHERE userid='${userId}' AND projectid='${projectId}'`;
    let result = await dbService.query(queryCmd);
    if (result.length > 0) { return true; }
    return false;
}

module.exports.addAccess = async function (userId, projectId) {
    const queryCmd = `INSERT INTO projects_users (projectid, userid) VALUES ('${projectId}', '${userId}')`;
    await dbService.query(queryCmd);
}

module.exports.getProject = async function (projectId) {
    const queryCmd = `SELECT * FROM projects WHERE id='${projectId}'`;
    let projectData = await dbService.query(queryCmd);
    return projectData[0];
}

module.exports.getAllProjects = async function (userId) {
    const queryCmd = `SELECT * FROM projects WHERE id IN (SELECT projectid FROM projects_users WHERE userid='${userId}')`;
    let projectData = await dbService.query(queryCmd);
    return projectData;
}

module.exports.createProject = async function (title, description) {
    const queryCmd = `INSERT INTO projects (title, description) VALUES ('${title}', '${description}')`;
    const response = await dbService.query(queryCmd);
    return response.insertId;
}

module.exports.updateProject = async function (projectId, title, description) {
    const queryCmd = `Update projects SET title = '${title}', description = '${description}' WHERE id = '${projectId}'`;
    await dbService.query(queryCmd);
}

module.exports.deleteProject = async function (projectId) {
    const queryCmd = `DELETE FROM projects WHERE id = '${projectId}'`;
    await dbService.query(queryCmd);
}