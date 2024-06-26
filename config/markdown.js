// Generate responsive images
// Based on https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/
const markdownOptions = {
  html: true, // Allows HTML
  breaks: true // Converts \n to linebreaks
};

const markdown = require('markdown-it')(markdownOptions);
const Image = require('@11ty/eleventy-img');

markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  function figure(html, caption) {
    return `<figure>${html}<figcaption>${caption}</figcaption></figure>`;
  }

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

  const imgOpts = {
    widths: imageWidths,
    formats: ['jpg', 'png'],
    urlPath: `./`,
    outputDir: `./_site${env.page.url}`
  };

  // Run generator in a try block to catch any missing images/errors
  try {
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
  } catch (error) {
    // If an image can't be found, the markdown doesn't
    // render anything and the build continues with a warning
    console.log(
      `WARNING: Error processing image ${imgSrc} in markdown: \n`,
      error
    );
    return '';
  }
};

module.exports = markdown;
