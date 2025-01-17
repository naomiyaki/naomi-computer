// Custom collection API functions
const MarkdownItContainer = require('markdown-it-container');

const getFilters = require('./config/getFilters.js');
const getProjectListings = require('./config/getProjectListings.js');
const blockContainers = require('./config/blockContainers.js');

// Nunjucks Extensions
const minifyJS = require('./config/minifyJS.js');

// Markdown modifications in their on file
const markdown = require('./config/markdown.js');

const { mila, milaOptions } = require('./config/mila.js');

// Add a custom collection with a list of filters that are used on projects, and the permalinks for the posts they contain
module.exports = function (eleventyConfig) {
  // Custom Shortcode to get the current year, useful for copyright
  // and stuff
  eleventyConfig.addShortcode('year', function () {
    const today = new Date();
    return today.getFullYear();
  });

  eleventyConfig.addAsyncFilter('unslugify', function (slug) {
    const words = slug.split('-');
    const capitalized = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalized.join(' ');
  });

  // Get only content that matches a tag
  eleventyConfig.addCollection('filters', getFilters);
  eleventyConfig.addCollection('projectListings', getProjectListings);
  eleventyConfig.addNunjucksAsyncFilter('minJS', minifyJS);

  // Adds jpg and png files inside of collection item directories without
  // touching the usual config defaults
  eleventyConfig.addTemplateFormats(['jpg', 'png', 'gif', 'mp4', 'webm']);

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
      // Get a version of each block's render function (if it has one)
      // that has access to Markdown-it
      const options = {};
      if (block.options && block.options.render) {
        options.render = block.options.render(mdLib);
      }

      mdLib.use(MarkdownItContainer, block.match, options);
    });
  });

  // This one is for a basic 1-2 image treatment that is
  // controlled with styles

  // Passthrough the CNAME file to configure domain name on gh-pages
  // https://github.com/orgs/community/discussions/22366
  eleventyConfig.addPassthroughCopy('CNAME');

  // Passthrough assets for non-bundled like images and fonts
  eleventyConfig.addPassthroughCopy('assets');
};
