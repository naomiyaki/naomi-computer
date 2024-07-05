const { minify } = require('terser');

module.exports = async function minifyJS(code, callback) {
  // Minify JS code in Nunjucks templates
  try {
    const minified = await minify(code);
    callback(null, minified.code);
  } catch (err) {
    console.error('Terser error: ', err);
    // Fail gracefully with original code
    callback(null, code);
  }
};
