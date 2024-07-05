// Custom collection API functions
const getFilters = require('./config/getFilters.js');
const getProjectListings = require('./config/getProjectListings.js');

// Nunjucks Extensions
const minifyJS = require('./config/minifyJS.js');

// Markdown modifications in their on file
const markdown = require('./config/markdown.js');

// Add a custom collection with a list of filters that are used on projects, and the permalinks for the posts they contain
module.exports = function (eleventyConfig) {
  // Get only content that matches a tag
  eleventyConfig.addCollection('filters', getFilters);
  eleventyConfig.addCollection('projectListings', getProjectListings);
  eleventyConfig.addNunjucksAsyncFilter('minJS', minifyJS);

  // Adds jpg and png files inside of collection item directories without
  // touching the usual config defaults
  eleventyConfig.addTemplateFormats(['jpg', 'png']);

  // Modify markdown image processing to use eleventy-img
  // generate responsive images
  eleventyConfig.setLibrary('md', markdown);

  // Passthrough assets for non-bundled like images and fonts
  eleventyConfig.addPassthroughCopy('assets');
};
