import { gql } from '@apollo/client';

export const CategoryFragements = {
  Nav: gql`
    fragment CategoryNavItems on CategoryTree {
      canonical_url
      children_count
      image
      include_in_menu
      is_anchor
      landing_page
      level
      name
      path
      position
      product_count
      image
      uid
      url_key
      url_path
      url_suffix
      id
    }
  `,
};
