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

// Add a custom collection with a list of filters that are used on projects, and the permalinks for the posts they contain
module.exports = function (eleventyConfig) {
  // Get only content that matches a tag
  eleventyConfig.addCollection('filters', getFilters);
  eleventyConfig.addCollection('projectListings', getProjectListings);
};
