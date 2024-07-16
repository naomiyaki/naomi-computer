// Render/Markup function for custom container spoiler configuration

module.exports = {
  match: 'punch',
  render: function (md) {
    // Not using it currently, but nesting the return
    // allows passing the markdown-it library in-case additional
    // markdown rednering is required
    return function (tokens, idx) {
      // User can pass a custom class in addition to "punch"
      // by using the same escape notation as images "@class[classnames]"
      const classRegex = /(?:@class\[([a-z0-9-\s]*)\])/;
      const classMatch = tokens[idx].info.trim().match(classRegex);
      const customClasses =
        classMatch && classMatch.length >= 2 ? classMatch[1] : '';

      if (tokens[idx].nesting === 1) {
        // Return opening tag
        return `<div class="punch${customClasses ? ' ' + customClasses : ''}">`;
      } else {
        // Return ending tab
        return '</div>';
      }
    };
  }
};
