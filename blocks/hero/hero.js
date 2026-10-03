/*
 * Hero block
 * Expects authored content in the standard EDS table format:
 *   Row 1: optional image
 *   Row 2: heading
 *   Row 3: optional subtext / CTA link
 *
 * This block demonstrates the standard EDS decoration pattern:
 * read the authored DOM, restructure it semantically, and let CSS
 * handle layout. No framework, no build step, minimal JS.
 */

export default function decorate(block) {
  const rows = [...block.children];

  // First row may contain a picture - if so, pull it out and tag it
  const picture = block.querySelector('picture');
  if (picture) {
    const pictureRow = picture.closest('div');
    pictureRow.classList.add('hero-image');
  }

  // Remaining rows become the text content wrapper
  const textRows = rows.filter((row) => !row.classList.contains('hero-image'));
  const textWrapper = document.createElement('div');
  textWrapper.className = 'hero-content';
  textRows.forEach((row) => textWrapper.append(row));
  block.append(textWrapper);

  // Promote the first heading found so it's unambiguous for a11y tooling
  const heading = textWrapper.querySelector('h1, h2, h3');
  if (heading) {
    heading.classList.add('hero-heading');
  }

  // If the last paragraph is a single link, style it as a CTA
  const paragraphs = [...textWrapper.querySelectorAll('p')];
  const last = paragraphs[paragraphs.length - 1];
  if (last && last.querySelector('a') && last.textContent.trim() === last.querySelector('a').textContent.trim()) {
    last.classList.add('hero-cta');
  }
}
