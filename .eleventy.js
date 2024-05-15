const { minify } = require('terser');

// Separate major API calls into separate functions
const getFilters = function (collectionApi) {
  const projects = collectionApi.getFilteredByTag('project');
  // Iterate each project and create an array of filters.
  const filters = [];

  projects.forEach((project) => {
    project.data.filters.forEach((filter) => {
      if (filters.indexOf(filter) < 0) {
        // The filter hasn't been registereed! Let's add it
        filters.push(filter);
      }
    });
  });

  return filters;
};

const getProjectListings = function (collectionApi) {
  const projects = collectionApi.getFilteredByTag('project');
  // Create a simplified array of projects with
  // only their short-title, image url (later), filters, and
  // computed url
  return projects.map((project) => {
    return {
      name: project.data.name,
      filters: project.data.filters,
      url: project.url
    };
  });
};

const minifyJS = async function (code, callback) {
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

// Add a custom collection with a list of filters that are used on projects, and the permalinks for the posts they contain
module.exports = function (eleventyConfig) {
  // Get only content that matches a tag
  eleventyConfig.addCollection('filters', getFilters);
  eleventyConfig.addCollection('projectListings', getProjectListings);
  eleventyConfig.addNunjucksAsyncFilter('minJS', minifyJS);

  // Passthrough assets for non-bundled like images and fonts
  eleventyConfig.addPassthroughCopy('assets');
};
