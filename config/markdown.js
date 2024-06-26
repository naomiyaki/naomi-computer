// Generate responsive images
// Based on https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/

// Title Tag Custom Handling
// ----------
// @skip[<NUMBER><UNIT>, <NUMBER><UNIT>] skips image/responsive size
// generation altogether. Important for declaring sizes on an image from another site,
// or if only one size is desired for some reason.
// Example:
// "@skip[100px,200px] Title which also becomes a figure caption"

const markdownOptions = {
  html: true, // Allows HTML
  breaks: true // Converts \n to linebreaks
};

const markdown = require('markdown-it')(markdownOptions);
const Image = require('@11ty/eleventy-img');

markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  // Custom HTML for images with a title tag to be used as a caption
  function figure(html, caption) {
    return `<figure>${html}<figcaption>${caption}</figcaption></figure>`;
  }

  const token = tokens[idx];
  // Image src is from the markdown project directory
  const imgSrc = token.attrGet('src');

  let imgPath = '.' + env.page.url + token.attrGet('src');
  const imgAlt = token.content;
  const imgTitle = token.attrGet('title');

  const htmlOpts = {
    title: imgTitle,
    alt: imgAlt,
    class: 'content-image',
    loading: 'lazy',
    decoding: 'async'
  };

  // Parse title text for any custom handling
  // Skip generating if using custom title code, or if the image is external
  const titleRegex =
    /^(?<skip>@skip(?:\[(?<width>\d+[a-z]*),\s*(?<height>\d+[a-z]*)]))\s*(?<titlecap>.*)/;
  const match = (imgTitle || '').match(titleRegex);
  const parsed = match ? match.groups : {};

  // If an image is from an external source, skip responsive image generation
  if (imgSrc.startsWith('http')) {
    // Get the filetype from the end of the source, to use with metadata
    // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    const fileTypeRegex = /(?:\.([^.]+))?$/;
    const fileType = fileTypeRegex.exec(imgSrc)[1];

    // Adjust HTML options for external image
    const adjHtmlOpts = { ...htmlOpts };
    // Apply custom class based on image type
    adjHtmlOpts.class = 'content-image external-image';

    // Generate metadata based on filetype
    const metadata = {};
    metadata[fileType] = [{ url: imgSrc }];

    const generated = Image.generateHTML(metadata, adjHtmlOpts);
    return generated;
  }

  // Add default image widths
  const imageWidths = [690, 1380, 2070];
  const imageSizes = '690w, 1380w';

  const imgOpts = {
    widths: imageWidths,
    formats: ['jpg', 'png'],
    urlPath: `./`,
    outputDir: `./_site${env.page.url}`
  };

  // Run generator in a try block to catch any missing images/errors
  try {
    Image(imgPath, imgOpts);
    const metadata = Image.statsSync(imgPath, imgOpts);
    const generated = Image.generateHTML(metadata, {
      sizes: imageSizes,
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
