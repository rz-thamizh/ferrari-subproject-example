export function buildPageTitle(title, storeConfig) {
  const titles = [];

  if (storeConfig.title_prefix) {
    titles.push(storeConfig.title_prefix);
  }

  titles.push(title || storeConfig.default_title);

  if (storeConfig.title_suffix) {
    titles.push(storeConfig.title_suffix);
  }
  return titles.join(' ');
}
