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

// Heading markup for when a filter is applied
const createFilterHeaderMarkup = function (filter) {
  // Todo: Built a more centralized function to capitalize every word
  // in a filter, and make it accessible to njk and js
  const capitalizedFilter = filter.charAt(0).toUpperCase() + filter.slice(1);

  return `
    <table class="filter-header">
    <tbody>
        <tr class="header-space">
            <td colspan="3">&nbsp;</td>
        </tr>
        <tr class="header-nav">
            <td class="label">
                <span>Filter</span>
            </td>
            <td class="filter-name">
                ${capitalizedFilter}
            </td>
            <td>
                <button onclick="showAllProjects(event)" class="filters-clear unstyled-button">
                    <img src="/assets/images/filters-clear-button01.png"/>
                    Show All Projects
                </button>
            </td>
        </tr>
    </tbody>
  </table>
  `;
};

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
  // Only use "filter-container class" if there's
  // an active filter.
  return `
    ${filter ? createFilterHeaderMarkup(filter) : ''}
    <div class="${filter ? 'filter-container' : ''}">
      <ul class="unstyled-list">
          ${filtered
            .map((project) => {
              return `
                  <li>
                      <a 
                        onmouseover="addHoverClass(event)" 
                        onmouseleave="removeHoverClass(event)"
                        href="${project.url}"
                      >
                        <figure>
                          <div class="thumb">
                            <div class="thumb-image" style="background-image: url('${project.url}${project.image}');"></div>
                          </div>
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
    </div>
  `;
};

// Set the default markup for the projects list
// This function is also used for "clearing" filters
const showAllProjects = function (e) {
  if (e) {
    // Prevent any form submissions
    e.preventDefault();
  }

  projectsList.innerHTML = createProjectListMarkup(projects);
};

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

// Add and remove a parent class when an item is hovered
// for further styling in CSS
const addHoverClass = function (e) {
  projectsList.classList.add('item-hovered');
};

const removeHoverClass = async function (e) {
  // Normally would require a debounce, but CSS is taking care
  // of the delayed transition
  projectsList.classList.remove('item-hovered');
};

// Check the query string to see if a filter is already applied
// by the URL
const urlParams = new URLSearchParams(window.location.search);
const filterParam = urlParams.get('projectFilter');

// If there's a filter in the query string, make sure it's
// a real one
const isQueryValid =
  filterParam &&
  filters.some((element) => {
    // Use a case insensitive comparison between query string
    // and filters
    return element.dataset.filter.toLowerCase() === filterParam.toLowerCase();
  });

console.log('Is query valid??', isQueryValid);

// If there's a valid query string, pre-set the filter
if (isQueryValid) {
  projectsList.innerHTML = createProjectListMarkup(
    projects,
    filterParam.toLowerCase()
  );
} else {
  // Otherwise, show all projects when the script starts;
  showAllProjects();
}
