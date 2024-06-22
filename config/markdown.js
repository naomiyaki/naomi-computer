// Generate responsive images
// Based on https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/
const markdown = require('markdown-it')();
const Image = require('@11ty/eleventy-img');

markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  // Image src is from the markdown project directory
  let imgSrc = '.' + env.page.url + token.attrGet('src');
  const imgAlt = token.content;
  const imgTitle = token.attrGet('title');

  const htmlOpts = {
    title: imgTitle,
    alt: imgAlt,
    class: 'content-image',
    loading: 'lazy',
    decoding: 'async'
  };

  const widths1x = [225, 350, 690, 990, 1390];
  // Add Widths for 2x screens and remove any duplicates
  const imageWidths = widths1x
    .concat(widths1x.map((w) => w * 2))
    .filter((v, i, s) => s.indexOf(v) === i);

  const imgOpts = {
    widths: imageWidths,
    formats: ['jpg', 'png'],
    urlPath: `./`,
    outputDir: `./_site${env.page.url}`
  };

  Image(imgSrc, imgOpts);
  const metadata = Image.statsSync(imgSrc, imgOpts);
  const generated = Image.generateHTML(metadata, {
    sizes: '225px',
    ...htmlOpts
  });

  if (imgTitle) {
    return figure(generated, imgTitle);
  }

  return generated;
};

module.exports = markdown;
