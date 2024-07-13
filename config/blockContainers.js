// Combine all custom block container declarations with matching
// "match" and "render" properties into an array that can be
// iterated to apply the same plugin
const punch = require('./punch.js');
const spoiler = require('./spoiler.js');

module.exports = [punch, spoiler];
