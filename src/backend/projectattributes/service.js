const dbService = require('../database/service')

module.exports.createAttribute = async function (projectId, attributeName, attributeDescription, attributeDataType, attributeValue) {
    const queryCmd = `INSERT INTO projectattributes (projectid, name, description, datatype, value) VALUES ('${projectId}','${attributeName}','${attributeDescription}','${attributeDataType}','${attributeValue}');`;
    const response = await dbService.query(queryCmd);
    return response.insertId;
}

module.exports.updateAttribute = async function (attributeId, projectId, attributeName, attributeDescription, attributeDataType, attributeValue) {
    const queryCmd = `UPDATE projectattributes SET projectid='${projectId}', name='${attributeName}', description='${attributeDescription}', datatype='${attributeDataType}', value='${attributeValue}' WHERE id='${attributeId}'`;
    const response = await dbService.query(queryCmd);
}

module.exports.getAttributeList = async function (projectId) {
    const queryCmd = `SELECT * FROM projectattributes WHERE projectid='${projectId}'`;
    let attributeList = await dbService.query(queryCmd);
    return attributeList;
}

module.exports.getAttribute = async function (attributeId) {
    const queryCmd = `SELECT * FROM projectattributes WHERE id='${attributeId}'`;
    const attribute = await dbService.query(queryCmd);
    return attribute[0];
}

module.exports.deleteAttribute = async function (attributeId) {
    const queryCmd = `DELETE FROM projectattributes WHERE id='${attributeId}'`;
    await dbService.query(queryCmd);
}

