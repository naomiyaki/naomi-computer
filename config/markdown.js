// Generate responsive images
// Based on https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/

// Title Tag Custom Handling
// ----------
// @skip[<NUMBER><UNIT>, <NUMBER><UNIT>] skips image/responsive size
// generation altogether. Important for declaring sizes on an image from another site,
// or if only one size is desired for some reason.
// Example:
// "@skip[100px,200px] Title which also becomes a figure caption"

// Setup defaults up top for easy customization
const defaultWidths = [720, 1380, 2070];
const defaultSizes = '100%';

const markdownOptions = {
  html: true, // Allows HTML
  breaks: true // Converts \n to linebreaks
};

const markdown = require('markdown-it')(markdownOptions);
const Image = require('@11ty/eleventy-img');

markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  // Custom HTML for images with a title tag to be used as a caption
  function figure(html, caption) {
    return `<figure class="content-image-with-caption">${html}<figcaption>${caption}</figcaption></figure>`;
  }

  const token = tokens[idx];
  // Image src is from the markdown project directory
  const imgSrc = token.attrGet('src');

  let imgPath = '.' + env.page.url + token.attrGet('src');
  const imgAlt = token.content;
  const imgTitle = token.attrGet('title');

  // Parse title text for any custom handling,
  // Using multiple regexes so custom attributes can be in any order
  const classRegex = /(?:@class\[([a-z0-9-\s]*)\])/;
  const classMatch = (imgTitle || '').match(classRegex);
  const customClasses =
    classMatch && classMatch.length >= 2 ? classMatch[1] : null;

  // Create an array out of a list of
  // custom widths
  const widthRegex = /(?:@widths\[([0-9,\s]*)\])/;
  const widthMatch = (imgTitle || '').match(widthRegex);
  const customWidths =
    widthMatch && widthMatch.length >= 2
      ? widthMatch[1].split(',').map((s) => {
          return parseInt(s);
        })
      : null;

  // Allow for custom size breakpoints too!
  const sizesRegex = /(?:@sizes\[([a-z0-9,-:\(\)\s]*)\])/;
  const sizesMatch = (imgTitle || '').match(sizesRegex);
  const customSizes =
    sizesMatch && sizesMatch.length >= 2 ? sizesMatch[1] : null;

  // Create a version of the title string without any width/class/size matches
  // and store it as a caption text
  const titleUncoded = imgTitle
    ? imgTitle
        .replace(classRegex, '')
        .replace(widthRegex, '')
        .replace(sizesRegex, '')
    : null;

  // Assign this to the caption text, or make it null if there's only spaces left
  const captionText =
    titleUncoded && titleUncoded.replace(/\s/g, '').length > 0
      ? titleUncoded
      : null;

  // Setup HTML options including any custom attributes
  const htmlOpts = {
    title: captionText,
    alt: imgAlt,
    class: `content-image${customClasses ? ' ' + customClasses : ''}`,
    loading: 'lazy',
    decoding: 'async'
  };

  // If an image is from an external source, skip responsive image generation
  if (imgSrc.startsWith('http')) {
    // Get the filetype from the end of the source, to use with metadata
    // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    const fileTypeRegex = /(?:\.([^.]+))?$/;
    const fileType = fileTypeRegex.exec(imgSrc)[1];

    // Adjust HTML options for external image
    const adjHtmlOpts = { ...htmlOpts };
    // Apply custom class based on image type
    adjHtmlOpts.class = `${adjHtmlOpts.class} external-image`;

    // Generate metadata based on filetype
    const metadata = {};
    metadata[fileType] = [{ url: imgSrc }];

    const generated = Image.generateHTML(metadata, adjHtmlOpts);
    return generated;
  }

  // Add default image widths
  const imageWidths = customWidths ? customWidths : defaultWidths;
  let imageSizes = customSizes ? customSizes : defaultSizes;

  // Optionally check image sizes
  // console.log(`
  //   Generating image: ${imgSrc}\r
  //   --------------------
  //   Image Widths: ${imageWidths}\r
  //   Sizes: ${imageSizes}
  // `);

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

    if (captionText) {
      return figure(generated, captionText);
    }

    // Return image in blank div so that it escapes being in a paragraph
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
