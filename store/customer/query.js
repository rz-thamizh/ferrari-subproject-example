import { gql } from '@apollo/client';

export const CreateCustomerMuation = gql`
mutation createCustomerV2(
  $firstname: String!,
  $lastname: String!,
  $email: String!,
  $password: String!,
  $is_subscribed: Boolean,
  $ssn: String!,
) {
  createCustomerV2(input: {
    firstname: $firstname,
    lastname: $lastname,
    email: $email,
    password: $password,
    is_subscribed: $is_subscribed,
    ssn: $ssn,
  }) {
  customer {
    firstname, middlename, lastname
    email,
    is_subscribed,
    ssn
  }
  }

  generateCustomerToken(
    email: $email
    password: $password
  ) {
    token
  }
}
`;

export const UpdateCustomerMuation = gql`
mutation updateCustomer (
  $firstname: String!,
  $lastname: String!,
  $email: String!,
  $password: String!,
) {
  updateCustomer(
    input: {
      firstname: $firstname,
      lastname: $lastname,
      email: $email,
      password: $password,
    }
  ) {
    customer {
      firstname,
      lastname,
      email,
    }
  }
}
`;

export const UpdateCustomerNewLetterMuation = gql`
mutation updateCustomer (
  $is_subscribed: Boolean,
) {
  updateCustomer(
    input: {
      is_subscribed: $is_subscribed,
    }
  ) {
    customer {
      is_subscribed
    }
  }
}
`;

export const UpdateCustomerPasswordMuation = gql`
mutation changePassword (
  $currentPassword: String!,
  $newPassword: String!,
) {
  changeCustomerPassword(
    currentPassword: $currentPassword,
    newPassword: $newPassword,
    ) {
      email
    }
  }
`;

export const CustomerTokenMutation = gql`
mutation customerToken(
  $email: String!,
  $password: String!,
) {
  generateCustomerToken(
    email: $email
    password: $password
  ) {
    token
  }
}
`;

export const CustomerOrderFields = gql`
  fragment CustomerOrderFields on CustomerOrder {
    id
    number
    status
    order_date
    total {
      grand_total { value, currency }
    }
    shipping_method
    shipping_address {
      firstname, lastname,
    }
  }
`;

export const CustomerOrderDetailFields = gql`
  fragment CustomerOrderDetailFields on CustomerOrder {
    id
    number
    status
    order_date
    rz_ssn
    total {
      discounts {
        amount { value, currency }
        label
      }
      total_shipping { value, currency }
      subtotal  { value, currency }
      total_tax  { value, currency }
      grand_total { value, currency }
      taxes {
        amount { value, currency },
        title
      }
    }
    shipping_method
    shipping_address {
      firstname, lastname,
      company, street
      city, postcode,
      telephone
    }
    carrier
    payment_methods {
      name
      type
      additional_data { name, value }
    }
    items {
      id,
      product_sku, product_url_key
      product_name
      product_sale_price { value, currency }
      quantity_ordered
      selected_options { label, value }
      entered_options { label, value }
    }
  }
`;

export const CustomerSummaryQuery = gql`
  query customerSummary (
    $currentPage: Int,
    $pageSize: Int
  ) {
    customer {
      firstname, lastname, email
      orders(currentPage:$currentPage, pageSize: $pageSize) {
        total_count
        items {
          ...CustomerOrderFields
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
    }
  }
  ${CustomerOrderFields}
`;

export const CustomerProfileMiniQuery = gql`
  query customerProfileMini {
    customer {
      firstname, lastname, email, is_subscribed,
      ssn,
      rz_allow_invoice,
      rz_is_b2b,
    }
  }
`;

export const CustomerOrderQuery = gql`
  query customerOrder($orderNumber: String!) {
    customer {
      email
      orders(filter: { number: { eq: $orderNumber } }) {
        items {
          ...CustomerOrderDetailFields
        }
      }
    }
  }
  ${CustomerOrderDetailFields}
`;

export const WishListItemFields = gql`
  fragment WishListItemFields on Wishlist {
    id
    items_count
    items_v2 {
      items {
        id
        quantity
        ... on BundleWishlistItem {
          bundle_options {
            values {
              id
              label
              quantity
            }
          }
        }
        product {
          uid
          name
          url_key
          sku
          special_from_date
          price_range {
            minimum_price {
              regular_price {
                currency
                value
              }
            }
            maximum_price {
              regular_price {
                currency
                value
              }
            }
          }
        }
      }
    }
  }
`;

export const CustomerWishListQuery = gql`
  query customerWishList($wishListId: ID!, $pageSize: Int!) {
    customer {
      wishlist_v2(id: $wishListId) {
        id
        items_count
        items_v2(pageSize: $pageSize) {
          items {
            id
            product {
              uid
              name
              sku
              url_key
              url_suffix
              rz_gallery_meta
              thumbnail {
                disabled
                url
              }
              stock_status
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
              crosssell_products {
                uid
                sku
                url_key
                name
                new
                url_suffix
                canonical_url
                url_suffix
                stock_status
                rz_gallery_meta
                image {
                  disabled
                  url
                }
            
                special_from_date
                price_range {
                  minimum_price {
                    final_price {
                      currency
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const AddToWishListMutation = gql`
  mutation AddToWishListMutation($wishListId: ID!, $wishListItems: [WishlistItemInput!]!){
    addProductsToWishlist(
      wishlistId: $wishListId
      wishlistItems: $wishListItems
    ) {
      wishlist {
        ...WishListItemFields
      }
    }
  }
  ${WishListItemFields}
`;

export const RemoveFromWishListMutation = gql`
  mutation RemoveFromWishListMutation($wishListId: ID!, $wishlistItemsIds: [ID!]!){
    removeProductsFromWishlist(
      wishlistId: $wishListId
      wishlistItemsIds: $wishlistItemsIds
    ) {
      wishlist {
        ...WishListItemFields
      }
    }
  }
  ${WishListItemFields}
`;

export const CustomerAddressesQuery = gql`
  query CustomerAddresses {
    customer {
      addresses {
        id
        firstname
        lastname
        street
        city
        region {
          region_code
          region
        }
        postcode
        country_code
        telephone
        company
        default_shipping
        default_billing
        rz_ssn
      }
    }
  }
`;

export const CreateCustomerAddressMutation = gql`
mutation createCustomerAddress(
  $city: String!,
  $postcode: String!,
  $firstname: String!,
  $lastname: String!,
  $company: String!,
  $telephone: String!,
  $street: [String!],
  $country_code: CountryCodeEnum!
  $default_shipping: Boolean,
  $default_billing: Boolean,
  $ssn: String!,
){
  createCustomerAddress(input: {
    street: $street,
    telephone: $telephone,
    postcode: $postcode,
    city: $city,
    company: $company,
    firstname: $firstname,
    lastname: $lastname,
    country_code: $country_code,
    default_billing: $default_billing,
    default_shipping: $default_shipping,
    rz_ssn: $ssn,
  }) {
    id
    country_code
    street
    telephone
    postcode
    city
    firstname
    lastname
    default_shipping
    default_billing
    rz_ssn
  }
}
`;

export const UpdateCustomerAddressMutation = gql`
mutation updateCustomerAddress(
  $id: Int!,
  $city: String!,
  $postcode: String!,
  $firstname: String!,
  $lastname: String!,
  $company: String!,
  $telephone: String!,
  $street: [String!],
  $default_shipping: Boolean,
  $default_billing: Boolean,
  $ssn: String!,
){
  updateCustomerAddress(id: $id, input: {
    city: $city,
    postcode: $postcode,
    firstname: $firstname,
    lastname: $lastname,
    company: $company,
    telephone: $telephone,
    street: $street,
    default_billing: $default_billing,
    default_shipping: $default_shipping,
    rz_ssn: $ssn,
  }) {
    id
    firstname
    lastname
    city
    company
    telephone
    postcode
    default_billing,
    default_shipping,
    rz_ssn
  }
}
`;

export const DeleteCustomerAddress = gql`
mutation deleteCustomerAddress (
  $id: Int!,
) {
  deleteCustomerAddress(
      id: $id,
    )
  }
`;

export const StockAlertMutation = gql`
  mutation StockAlertMutation(
    $productSku: String!,
    $email: String!,
  ) {
    rzCreateStockAlert(sku: $productSku, cutomerEmail: $email) {
      msg
      status
    }
  }
`;

export const ProductEnquiryMutation = gql`
  mutation ProductEnquiryMutation(
    $productId: Int!,
    $email: String!,
    $name: String!,
    $msg: String!,
    $recipientsEmail: String!, 
  ) {
    sendEmailToFriend(input: {
      product_id: $productId,
      recipients: {
        name: "Admin",
        email: $recipientsEmail,
      }
      sender: {
        name: $name,
        email: $email,
        message: $msg
      }
    }) {
      sender {
        email
        name
      }
    }
  }
`;

export const subscribeEmailToNewsletterMutation = gql`
  mutation subscribeEmailToNewsletter(
    $email: String!
  ) {
    subscribeEmailToNewsletter(
      email: $email
    ) {
      status
    }
  }
`;

export const RequestPasswordResetEmailMutation = gql`
mutation requestPasswordResetEmail(
  $email: String!,
) {
  requestPasswordResetEmail(
    email: $email
  )
}
`;

export const ResetPasswordMutation = gql`
mutation resetPassword(
  $email: String!,
  $resetPasswordToken: String!,
  $newPassword: String!,
) {
  resetPassword(
    email: $email
    resetPasswordToken: $resetPasswordToken,
    newPassword: $newPassword,
  )
}
`;

export const RzContactFormMutation = gql`
  mutation RzContactFormMutation(
    $fullname: String!
    $email: String!
    $telephone: String!
    $message: String!
  ) {
    rzContactFormSubmit(
      input: {
        fullname: $fullname,
        email: $email,
        telephone: $telephone,
        message: $message,
      }
    ) {
      success_message
    }
  }
`;
