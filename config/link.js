// Render/Markup function for custom link block

module.exports = {
  match: 'link',
  options: {
    render: function (md) {
      // Not using it currently, but nesting the return
      // allows passing the markdown-it library in-case additional
      // markdown rednering is required
      return function (tokens, idx) {
        // User can pass a custom class in addition to "punch"
        // by using the same escape notation as images "@class[classnames]"
        const linkRegex =
          /(?:@link\[([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\])/;
        const linkMatch = tokens[idx].info.trim().match(linkRegex);
        const linkURL =
          linkMatch && linkMatch.length >= 2 ? linkMatch[1] : null;

        const external = linkURL && linkURL.includes('http');

        if (tokens[idx].nesting === 1) {
          // Return opening tag
          return `<a class="link-block" ${
            external ? 'target=_blank' : ''
          } href="${linkURL}">`;
        } else {
          // Return ending tab
          return '</a>';
        }
      };
    }
  }
};
