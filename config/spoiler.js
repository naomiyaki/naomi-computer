// Render/Markup function for custom container spoiler configuration

module.exports = {
  spoilerMatch: 'spoiler',
  renderSpoiler: function (md) {
    // Not using it currently, but nesting the return
    // allows passing the markdown-it library in-case additional
    // markdown rednering is required
    return function (tokens, idx) {
      // Match containing the spoiler content
      // Note that the match should be the same as above
      const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // Return opening tag
        return (
          '<div class="spoiler hidden">' +
          '<div class="spoiler-control">' +
          '<button>Spoiler/Hidden <span>Click To Show<span></button>' +
          '<div class="note">Reload page to re-hide</div>' +
          '</div>'
        );
      } else {
        // Return ending tab
        return '</div>';
      }
    };
  }
};
