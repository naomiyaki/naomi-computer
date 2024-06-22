// Creates a global array of filters based on all the filters
// used in projects
module.exports = function getFilters(collectionApi) {
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
