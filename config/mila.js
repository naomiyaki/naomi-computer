const mila = require('markdown-it-link-attributes');

module.exports = {
  mila: mila,
  milaOptions: {
    matcher(href) {
      return href.match(/^https?:\/\//);
    },
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  }
};
