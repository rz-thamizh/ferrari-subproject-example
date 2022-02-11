import { gql } from '@apollo/client';

export const StoreConfigQuery = gql`
  query storeConfig {
    storeConfig {
      allow_guests_to_write_product_reviews
      base_currency_code
      base_link_url
      base_media_url
      base_static_url
      base_url
      catalog_default_sort_by
      category_fixed_product_tax_display_setting
      cms_home_page
      code
      copyright
      default_description
      default_display_currency_code
      default_keywords
      default_title
      demonotice
      grid_per_page
      grid_per_page_values
      head_includes
      head_shortcut_icon
      header_logo_src
      id
      is_default_store
      is_default_store_group
      list_mode
      list_per_page
      list_per_page_values
      locale
      logo_alt
      magento_wishlist_general_is_enabled
      minimum_password_length
      no_route
      product_reviews_enabled
      root_category_id
      root_category_uid
      secure_base_link_url
      secure_base_media_url
      secure_base_static_url
      secure_base_url
      send_friend {
        enabled_for_customers
        enabled_for_guests
      }
      show_cms_breadcrumbs
      store_code
      store_group_code
      store_sort_order
      timezone
      title_prefix
      title_separator
      title_suffix
      use_store_in_url
      website_code
      website_id
      weight_unit
      product_url_suffix
      category_url_suffix
    }
  }
`;

export const WebsiteQuery = gql`
query WebsiteQuery($storeCode: String!) {
  rzdWebsite(filter: {websiteCode: {eq: $storeCode}}){
    id
    name
  }
}
`;

export const WebsiteStoresQuery = gql`
query WebsiteQuery($websiteId: ItemId!) {
  allRzdStores(filter: {website: {eq: $websiteId}, enable: {eq: true}}) {
    id
    name
    stockCode
    enablePickup
    sortOrder
    kind
  }
}
`;
