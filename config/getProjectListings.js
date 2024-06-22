module.exports = function getProjectListings(collectionApi) {
  const projects = collectionApi.getFilteredByTag('project');
  // Create a simplified array of projects with
  // only their short-title, image url (later), filters, and
  // computed url
  return projects.map((project) => {
    return {
      name: project.data.name,
      filters: project.data.filters,
      image: project.data.thumb,
      url: project.url
    };
  });
};
