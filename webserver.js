const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

console.log('In webserver right now:3');
console.log(`Port: ${port}`);

app.get('/', (req, res) => {
	res.send('Gambling Bot is alive nya~ :3');
	console.log('Gambling Bot is alive nya~ :3');
});

app.listen(port, () => {
	console.log(`Web server running on http://localhost:${port} :3`);
});
