// Custom collection API functions
const mdSpoiler = require('@traptitech/markdown-it-spoiler');

const getFilters = require('./config/getFilters.js');
const getProjectListings = require('./config/getProjectListings.js');

// Nunjucks Extensions
const minifyJS = require('./config/minifyJS.js');

// Markdown modifications in their on file
const markdown = require('./config/markdown.js');

const { mila, milaOptions } = require('./config/mila.js');

// Add a custom collection with a list of filters that are used on projects, and the permalinks for the posts they contain
module.exports = function (eleventyConfig) {
  // Get only content that matches a tag
  eleventyConfig.addCollection('filters', getFilters);
  eleventyConfig.addCollection('projectListings', getProjectListings);
  eleventyConfig.addNunjucksAsyncFilter('minJS', minifyJS);

  // Adds jpg and png files inside of collection item directories without
  // touching the usual config defaults
  eleventyConfig.addTemplateFormats(['jpg', 'png']);

  // Markdown Config
  // --------------------
  // Modify markdown image processing to use eleventy-img
  // generate responsive images
  eleventyConfig.setLibrary('md', markdown);

  // Use mila plugin to parse external links to open in a new window/tab
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(mila, milaOptions));

  // Use spoiler plugin so inline `!! spoiler !!` syntax generates a custom span tag
  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(mdSpoiler, { frontPriorMode: true })
  );

  // Passthrough assets for non-bundled like images and fonts
  eleventyConfig.addPassthroughCopy('assets');
};
