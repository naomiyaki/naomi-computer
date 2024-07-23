// Combine all custom block container declarations with matching
// "match" and "render" properties into an array that can be
// iterated to apply the same plugin
const fullSize = { match: 'full-size' };
const link = require('./link.js');
const punch = require('./punch.js');
const screenReader = { match: 'screen-reader' };
const spoiler = require('./spoiler.js');

module.exports = [fullSize, link, punch, screenReader, spoiler];
