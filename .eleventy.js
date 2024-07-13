// Custom collection API functions
const mdContainer = require('markdown-it-container');

const getFilters = require('./config/getFilters.js');
const getProjectListings = require('./config/getProjectListings.js');
const blockContainers = require('./config/blockContainers.js');

// Nunjucks Extensions
const minifyJS = require('./config/minifyJS.js');

// Markdown modifications in their on file
const markdown = require('./config/markdown.js');

const { mila, milaOptions } = require('./config/mila.js');
const MarkdownItContainer = require('markdown-it-container');

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

  // Use custom blocks with ::: syntax
  // Get an array of objects with a "match" string and render declaration
  // and apply each of them with the MarkdownItContainer plugin
  eleventyConfig.amendLibrary('md', (mdLib) => {
    blockContainers.forEach((block) => {
      mdLib.use(MarkdownItContainer, block.match, {
        render: block.render(mdLib)
      });
    });
  });

  // This one is for a basic 1-2 image treatment that is
  // controlled with styles

  // Passthrough assets for non-bundled like images and fonts
  eleventyConfig.addPassthroughCopy('assets');
};
