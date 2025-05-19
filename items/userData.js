const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/users_data.json');

// Read the user data JSON
function readData() {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, '{}', 'utf-8');
    }
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (err) {
    console.error('Error reading users_data.json:', err);
    return {};
  }
}

// Write the user data JSON
function writeData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to users_data.json:', err);
  }
}

// Check if user exists in data
function existData(userId) {
  const data = readData();
  if (!data[userId]) {
    data[userId] = {};
    writeData(data);
    return false;
  }
  return true;
}

module.exports = {
  readData,
  writeData,
  existData
};