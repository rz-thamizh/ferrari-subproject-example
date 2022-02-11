export const LayoutContainer = {
  FooterLinks: 'rz/footer/links',
  FooterSticky: 'rz/footer/sticky',
  Content: 'rz/content',
  ContentTop: 'rz/content/top',
  ContentBottom: 'rz/content/bottm',
  Sidebar: 'rz/sidebar',
};

export const MagentoContainersMap = {
  cms_footer_links_container: LayoutContainer.FooterLinks,
  content: LayoutContainer.Content,
  main: LayoutContainer.Content,
  content_top: LayoutContainer.ContentTop,
  'footer-container': LayoutContainer.FooterSticky,
  'content.top': LayoutContainer.ContentTop,
  'content.bottom': LayoutContainer.ContentBottom,
  'sidebar.main': LayoutContainer.Sidebar,
};

export function findLayoutContainer(name) {
  if (!MagentoContainersMap[name]) {
    console.log(`RZ: \t Unknown container "${name}"`);
    return null;
  }

  return MagentoContainersMap[name];
}
