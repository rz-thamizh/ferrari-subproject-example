import { gql } from '@apollo/client';

export const CustomAttributeMetaData = gql`
  query customAttributeMetadata($attributeCode: String!) {
    customAttributeMetadata(attributes: [
      { attribute_code: $attributeCode, entity_type: "catalog_product"}
    ]) {
      items {
        attribute_code
        attribute_options {
          label
          value
        }
        attribute_type
        entity_type
        input_type
      }
    } 
  }
`;

export const BrandCategoriesList = gql`
  query brandCategoriesList($brandId: String!) {
    products(filter: {
      rz_manufacturer: { eq: $brandId }
    }) {
      aggregations {
        attribute_code
        count
        label
        options {
          count
          label
          value
        }
      } 
    }
  }
`;

export const BrandsListQuery = gql`
  query ProductsFilterQuery(
    $filterQuery: ProductAttributeFilterInput,
    ) {
    products(filter: $filterQuery) {
      aggregations {
        attribute_code
        options {
          label
        }
      }
    }
  }
`;
