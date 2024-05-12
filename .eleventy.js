// Add a custom collection with a list of filters that are used on projects, and the permalinks for the posts they contain
module.exports = function (eleventyConfig) {
  // Get only content that matches a tag
  eleventyConfig.addCollection('filters', function (collectionApi) {
    const projects = collectionApi.getFilteredByTag('project');
    // Create a keyed filter object to store all the pages data
    // (which will be turned into an array later)
    const filterLookup = {};
    const filters = [];

    // Iterate each project and create an array of filters. If the filter exists in the array, add
    // the project name and url to the filter
    projects.forEach((project) => {
      project.data.filters.forEach((filter) => {
        if (filterLookup[filter]) {
          // The filter has already been registered, so
          // update the array and reassign it
          filterLookup[filter] = [
            ...filterLookup[filter],
            // It might be wise to do some data validation here one day
            { name: project.data.shorttitle, url: project.url }
          ];
        } else {
          // The filter is new! So let's add a freshie array with this page
          // as it's first entry
          filterLookup[filter] = [
            { name: project.data.shorttitle, url: project.url }
          ];
        }
      });
    });

    // Iterate the lookup object and create an array of filter objects
    // with a name and a list of projects
    for (let name in filterLookup) {
      filters.push({ name: name, projects: filterLookup[name] });
    }

    return filters;
  });
};
