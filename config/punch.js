// Render/Markup function for custom container spoiler configuration

module.exports = {
  match: 'punch',
  render: function (md) {
    // Not using it currently, but nesting the return
    // allows passing the markdown-it library in-case additional
    // markdown rednering is required
    return function (tokens, idx) {
      // Match containing the spoiler content
      // Note that the match should be the same as above
      const m = tokens[idx].info.trim().match(/^punch\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // Return opening tag
        return '<div class="punch">';
      } else {
        // Return ending tab
        return '</div>';
      }
    };
  }
};
