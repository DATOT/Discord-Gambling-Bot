const { readData, writeData, existData } = require('userData');

function existGamblingInfo(userId, data = null) {
	const actualData = data ?? readData();
	return actualData[userId]?.hasOwnProperty('hasStartedGambling');
}

function hasStartedGambling(userId, data = null) { 
	const actualData = data ?? readData();
	return existGamblingInfo(userId, data) && actualData[userId].hasStartedGambling;
}

function ensureGambling(userId, data = null) {
	const actualData = data ?? readData();
	if (!existGamblingInfo(userId, actualData)) {
		actualData[userId] = { ...(actualData[userId] || {}), hasStartedGambling: false };
		writeData(actualData); // Save changes if needed
	}
}

function setStartedGambling(userId, value) {
	const data = readData();
	ensureGambling(userId, data);
	data[userId].hasStartedGambling = value;
	writeData(data);
}

module.exports = {
	hasStartedGambling,
	setStartedGambling
};