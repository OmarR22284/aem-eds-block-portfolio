/*
 * Tabs block
 * Authored as a table where each row is one tab:
 *   Row 1, cell 1 = tab label, cell 2 = tab panel content
 *   Row 2, cell 1 = tab label, cell 2 = tab panel content
 *   ...
 *
 * Implements the ARIA Authoring Practices tabs pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * - roving tabindex
 * - arrow-key navigation
 * - tabpanel/tab relationship via aria-controls / aria-labelledby
 */

function buildTabList(rows, blockId) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  rows.forEach((row, i) => {
    const [labelCell, contentCell] = row.children;
    const tabId = `${blockId}-tab-${i}`;
    const panelId = `${blockId}-panel-${i}`;

    const tabButton = document.createElement('button');
    tabButton.className = 'tabs-tab';
    tabButton.id = tabId;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-controls', panelId);
    tabButton.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tabButton.tabIndex = i === 0 ? 0 : -1;
    tabButton.textContent = labelCell ? labelCell.textContent.trim() : `Tab ${i + 1}`;
    tablist.append(tabButton);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = i !== 0;
    if (contentCell) panel.append(...contentCell.childNodes);
    panels.append(panel);
  });

  return { tablist, panels };
}

function activateTab(tabs, panels, targetTab) {
  tabs.forEach((tab) => {
    const selected = tab === targetTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.id !== targetTab.getAttribute('aria-controls');
  });
  targetTab.focus();
}

export default function decorate(block) {
  const blockId = `tabs-${Math.random().toString(36).slice(2, 8)}`;
  const rows = [...block.children];
  const { tablist, panels } = buildTabList(rows, blockId);

  block.textContent = '';
  block.append(tablist, panels);

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panelEls = [...panels.querySelectorAll('[role="tabpanel"]')];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tabs, panelEls, tab));
  });

  tablist.addEventListener('keydown', (e) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      activateTab(tabs, panelEls, tabs[nextIndex]);
    }
  });
}
