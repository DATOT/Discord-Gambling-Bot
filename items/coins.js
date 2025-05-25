const { readData, writeData, existData } = require('./userData');

// Check if user has coins
function hasCoins(userId, data = null) { 
  const actualData = data ?? readData();
  return actualData[userId]?.hasOwnProperty('coins');
}

// Ensure user has coins, *this function is ignored when exporting*
function ensureCoins(userId, data = null) {
  const actualData = data ?? readData();
  
  if (!actualData[userId]) {
    actualData[userId] = {};
  }

  if (!hasCoins(userId, data)) {
    data[userId] = { ...(data[userId] || {}), coins: 0 };
  }
}

// Get user's coin count
function getCoins(userId) {
  const data = readData();
  ensureCoins(userId, data);
  return data[userId].coins;
}

// Set coins (overwrites the amount)
function setCoins(userId, amount) {
  const data = readData();
  ensureCoins(userId, data);
  data[userId].coins = amount;
  writeData(data);
}

// Add coins (increments)
function addCoins(userId, amount) {
  const data = readData();
  ensureCoins(userId, data);
  data[userId].coins += amount;
  writeData(data);
}

// Remove coins (decrements)
function removeCoins(userId, amount) {
  const data = readData();
  ensureCoins(userId, data);
  data[userId].coins -= amount;
  writeData(data);
}

module.exports = {
  hasCoins,
  getCoins,
  setCoins,
  addCoins
};
