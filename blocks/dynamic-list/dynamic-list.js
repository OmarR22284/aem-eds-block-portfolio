/*
 * Dynamic List block
 *
 * Demonstrates integrating EDS with an external content source at
 * runtime - e.g. an AEM GraphQL persisted query endpoint, a Content
 * Fragment Model exposed via AEM's GraphQL API, or any JSON API.
 *
 * Authoring: the first row's single cell holds the source URL.
 * Expects a JSON array of { title, description, url } objects.
 *
 * This pattern is how EDS pages stay static/fast while still
 * surfacing data that lives in AEMaaCS (or any other system) -
 * the fetch happens client-side after the shell page is already
 * painted, so Core Web Vitals aren't affected by the data source's
 * latency.
 */

function renderError(block, message) {
  block.innerHTML = `<p class="dynamic-list-error" role="alert">${message}</p>`;
}

function renderItems(block, items) {
  const list = document.createElement('ul');
  list.className = 'dynamic-list-items';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'dynamic-list-item';

    const link = document.createElement('a');
    link.href = item.url || '#';
    link.className = 'dynamic-list-link';

    const title = document.createElement('span');
    title.className = 'dynamic-list-title';
    title.textContent = item.title || '';

    const desc = document.createElement('span');
    desc.className = 'dynamic-list-description';
    desc.textContent = item.description || '';

    link.append(title, desc);
    li.append(link);
    list.append(li);
  });

  block.textContent = '';
  block.append(list);
}

export default function decorate(block) {
  const sourceUrl = block.textContent.trim();
  block.textContent = '';

  const loading = document.createElement('p');
  loading.className = 'dynamic-list-loading';
  loading.textContent = 'Loading…';
  block.append(loading);

  if (!sourceUrl) {
    renderError(block, 'No data source configured for this block.');
    return;
  }

  fetch(sourceUrl, { headers: { Accept: 'application/json' } })
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const items = Array.isArray(data) ? data : data.items;
      if (!items || !items.length) {
        renderError(block, 'No items available.');
        return;
      }
      renderItems(block, items);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('dynamic-list: failed to load data', err);
      renderError(block, 'Unable to load content right now.');
    });
}
