import { gql } from '@apollo/client';
import { CategoryFragements } from '@/store/category/fragments';

export const CategoryListQuery = gql`
  query categoryList {
    categoryList {
      products(currentPage: 1) {
        items {
          id
          name
          sku
          stock_status
          image {
            url
          }
          special_from_date
          price_range {
            maximum_price {
              final_price {
                value
              }
            }
          }
        }
      }
    }
  }
`;

export const CategoryNavQuery = gql`
  query categoryNavV1($parentCategory: String!){
    categories(
      filters: {
        parent_category_uid: { eq: $parentCategory }
      },
      pageSize: 100,
    ) {
      items {
        name
        ...CategoryNavItems
        children {
          ...CategoryNavItems
          children {
            ...CategoryNavItems
          }
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    } 
  }

  ${CategoryFragements.Nav}
`;

export const RootCategoriesQuery = gql`
  query rootCategories{
    categories {
      items {
        name
        uid
        id
        url_key
        url_path
        url_suffix
      }
    } 
  }
`;

export const CategoryQuery = gql`
query categoryQuery($id: String!){
  categories(filters: {
    category_uid: {
      eq: $id
    }
  }) {
    items {
      id
      available_sort_by
      breadcrumbs {
        category_level
        category_name
        category_uid
        category_url_key
        category_url_path
      }
      canonical_url
      children_count
      cms_block {
        content
        identifier
        title
      }
      custom_layout_update_file
      default_sort_by
      description
      display_mode
      filter_price_range
      image
      include_in_menu
      is_anchor
      landing_page
      level
      meta_description
      meta_keywords
      meta_title
      name
      path
      path_in_store
      position
      product_count
      uid
      url_key
      url_path
      url_suffix
    }
  }  
}
`;

export const CategoryInfoById = gql`
query categoryInfoById($id: String!){
  categories(filters: {
    ids: {
      eq: $id
    }
  }) {
    items {
      id
      available_sort_by
      default_sort_by
      description
      filter_price_range
      level
      meta_description
      meta_keywords
      meta_title
      name
      uid
      url_key
      url_path
      url_suffix
    }
  }  
}
`;

export const FeaturedCategories = gql`
  query rzFeaturedCategories($parentId: Int, $limit: Int!, $storeCode: String) {
    rzFeaturedCategories(parentId: $parentId, limit: $limit, storeCode: $storeCode) {
      categoryList {
        id
        name
        uid
        path
        url_key
        url_path
        level
        is_anchor
        position
        product_count
        featureOnLandingPages
        featureOnCategoryLandingPages
      }
    }
  }
`;

export const CategoryImmediateChildQuery = gql`
  query categoryImmediateChildQuery($parentCategory: String!){
    categories(
      filters: {
        parent_category_uid: { eq: $parentCategory }
      },
      pageSize: 100,
    ) {
      items {
        name
        id
        uid
        level
        url_key
        url_path
        url_suffix
      }
    } 
  }
`;
