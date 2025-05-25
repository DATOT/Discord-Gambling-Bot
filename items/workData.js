const { readData, writeData, existData } = require('./userData');

function hasWorkData(userId, data = null) {
  const actualData = data ?? readData();
  return actualData[userId]?.hasOwnProperty('workData');
}

// Ensure user has workData, *this function is ignored when exporting*
function ensureWorkData(userId, data = null) {
  const actualData = data ?? readData();

  if (!actualData[userId]) {
    actualData[userId] = {};
  }

  if (!hasWorkData(userId, actualData)) {
    console.log(`user with id: ${userId} dont have workData`);
    actualData[userId].workData = {
      lastReset: Date.now(),
      count: 0
    };
    writeData(actualData);
  }

  return actualData;
}

// Get user's work data
function getWorkData(userId) {
  const data = readData();
  ensureWorkData(userId, data);
  return data[userId].workData;
}

// Set/Update user's work data
function setWorkData(userId, newWorkData) {
  const data = readData();
  ensureWorkData(userId, data);
  data[userId].workData = {
    ...data[userId].workData,
    ...newWorkData
  };
  writeData(data);
}

// Reset user's work data
function resetWorkData(userId) {
  const data = readData();
  ensureWorkData(userId, data);
  data[userId].workData = {
    lastReset: Date.now(),
    count: 0
  };
  writeData(data);
}

// 🔢 Get the current count
function count(userId) {
  const data = readData();
  ensureWorkData(userId, data);
  return data[userId].workData.count;
}

// ⏱️ Get the lastReset timestamp
function lastReset(userId) {
  const data = readData();
  ensureWorkData(userId, data);
  return data[userId].workData.lastReset;
}

// increase count by 1
function increaseCount(userId) {
  const data = readData();
  ensureWorkData(userId, data);
  console.log(`count: ${data[userId].workData.count}`);
  data[userId].workData.count = data[userId].workData.count + 1;
  writeData(data);
}

module.exports = {
  hasWorkData,
  getWorkData,
  setWorkData,
  resetWorkData,
  count,
  lastReset,
  increaseCount,
};