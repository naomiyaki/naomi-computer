// Create JS Markup for the projects list
const scriptEl = document.getElementById('filter-projects-script');
const projectsText = scriptEl.dataset.projects;

if (!projectsText) {
  throw 'Error: No projects were passed to the projects list';
  // TODO: Try to trigger a no-js fallback here if,
  // for some reason, there was an issue with slurping up
  // the projects from Eleventy
}

// Register our main DOM elements
const component = document.getElementById('filter-projects');
const projectsList = document.getElementById('projects-list');
// Parse the text from the template
const projects = JSON.parse(projectsText);

const createProjectListMarkup = function (projects, filter) {
  // Reduce the projects array by a filter,
  // if one has been passed in
  const filtered = projects.filter((project) => {
    // If there's no filter, escape and return everything
    if (!filter) return project;
    // Otherwise, check if the project has the set filters
    return project.filters.some((test) => {
      return test === filter;
    });
  });

  // Build the markup with the filtered projects
  return `
        <ul class="unstyled-list">
            ${filtered
              .map((project) => {
                return `
                    <li>
                        <a href="${project.url}">
                          <figure>
                            <div class="thumb" style="background-image: url('${project.url}${project.image}');"></div>
                            <figcaption>
                              ${project.name}
                            </figcaption>
                          </figure>
                        </a>
                    </li>
                `;
              })
              .join('')}
        </ul>
    `;
};

// Set the default markup for the projects list
projectsList.innerHTML = createProjectListMarkup(projects);

// Set up the filters so that clicking them resets the HTML
const filterList = document.getElementById('filter-list');
const filters = [...filterList.getElementsByTagName('BUTTON')];

filters.forEach((element) => {
  const filter = element.dataset.filter;
  // For each filter, create an event handler to rewrite the
  // list with the filtered markup
  element.addEventListener('click', (e) => {
    e.preventDefault();
    projectsList.innerHTML = createProjectListMarkup(projects, filter);
  });
});
