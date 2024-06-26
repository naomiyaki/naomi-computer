// Generate responsive images
// Based on https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/
const markdownOptions = {
  html: true, // Allows HTML
  breaks: true // Converts \n to linebreaks
};

const markdown = require('markdown-it')(markdownOptions);
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

  // Add default image widths
  const imageWidths = [690, 1380, 2070];

  console.log('Widths!', imageWidths);

  const imgOpts = {
    widths: imageWidths,
    formats: ['jpg', 'png'],
    urlPath: `./`,
    outputDir: `./_site${env.page.url}`
  };

  Image(imgSrc, imgOpts);
  const metadata = Image.statsSync(imgSrc, imgOpts);
  const generated = Image.generateHTML(metadata, {
    sizes: '690w, 1380w',
    ...htmlOpts
  });

  if (imgTitle) {
    return figure(generated, imgTitle);
  }

  return generated;
};

module.exports = markdown;
