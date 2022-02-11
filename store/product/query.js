import { gql } from '@apollo/client';

export const ProductSketchFields = gql`
fragment productSketchFields on ConfigurableProduct {
  uid
  url_key
  name
  canonical_url
  url_suffix
  image {
    disabled
    url
  }
}
`;

export const ProductCardFields = gql`
  fragment productCardFields on ConfigurableProduct {
    ... on ConfigurableProduct {
      configurable_options {
        label
        position
        uid
        attribute_code
        values {
          label
          uid
          swatch_data {
            value
          }
        }
      }
    }
    canonical_url
    categories {
      name
      uid
      id
      url_key
      url_path
      url_suffix
    }
    rz_gallery_meta
    image {
      disabled
      label
      position
      url
    }
    rz_manufacturer
    name
    new
    special_from_date
    price_range {
      maximum_price {
        discount {
          amount_off
          percent_off
        }
        final_price {
          currency
          value
        }
        fixed_product_taxes {
          amount {
            currency
            value
          }
          label
        }
        regular_price {
          currency
          value
        }
      } 
      minimum_price {
        discount {
          amount_off
          percent_off
        }
        final_price {
          currency
          value
        }
        fixed_product_taxes {
          amount {
            currency
            value
          }
          label
        }
        regular_price {
          currency
          value
        }
      } 
    }
    price_tiers {
      discount {
        amount_off
        percent_off
      }
      final_price {
        value
        currency
      }
      quantity
    }
    sku
    special_price
    special_to_date
    stock_status
    uid
    url_key
    url_suffix
    # video_file
  }
`;
