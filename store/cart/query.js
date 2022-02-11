import { gql } from '@apollo/client';

export const CartItemFields = gql`
  fragment CareItemFields on Cart {
    id
    total_quantity
    prices {
      grand_total {
        currency
        value
      }
    }
    items {
      uid
      quantity
      prices {
        row_total_including_tax {
          currency
          value
        }
      }
      product {
        url_key
        name
        rz_gallery_meta
        thumbnail {
          disabled
          url
        }
      }
      ... on BundleCartItem {
        bundle_options {
          uid
          label
          type
          values {
            id
            label
            price
            quantity
          }
        }
      }
    }
  }
`;

export const CartMiniFields = gql`
  fragment CartMiniFields on Cart {
    id
    total_quantity
    email
    applied_coupons {
      code
    }
    prices {
      discounts {
        amount {
          value, currency
        }
        label
      }
      applied_taxes {
        amount { value, currency }, label
      }
      grand_total {
        value, currency
      }
    }
    items {
      uid
      quantity
      prices {
        discounts {
          amount {
            currency, value
          }
          label
        }
        total_item_discount {
          currency
          value
        }
        row_total_including_tax {
          currency
          value
        }
      }
      product {
        url_key, url_suffix
        sku
        name
        rz_gallery_meta
        thumbnail {
          disabled
          url
        }
        stock_status
      }
    }
  }
`;

export const CartDetailFields = gql`
  fragment CartDetailFields on Cart {
    id
    total_quantity
    email
    applied_coupons {
      code
    }
    prices {
      discounts {
        amount {
          value, currency
        }
        label
      }
      applied_taxes {
        amount { value, currency }, label
      }
      grand_total {
        value, currency
      }
      subtotal_excluding_tax {
        value, currency
      }
    }
    available_payment_methods {
      code, title
    }
    selected_payment_method {
      code, title, purchase_order_number
    }
    shipping_addresses {
      rz_ssn, rz_uid,
      firstname, lastname
      street, city, postcode
      company
      pickup_location_code
      telephone
      available_shipping_methods {
        amount { value, currency }, available,
        method_code, method_title,
        carrier_code, carrier_title,
        delivery_time_from, delivery_time_to, description
      }
      selected_shipping_method {
        amount {
          value, currency
        }
        carrier_code, carrier_title
        method_code, method_title
      }
    }
    items {
      uid
      quantity
      prices {
        discounts {
          amount {
            currency, value
          }
          label
        }
        total_item_discount {
          currency
          value
        }
        row_total_including_tax {
          currency
          value
        }
      }
      product {
        url_key, url_suffix
        sku
        name
        rz_gallery_meta
        thumbnail {
          disabled
          url
        }
        stock_status
      }
    }
  }
`;

export const CreateEmptyCartMutation = gql`
  mutation createEmptyCart {
    createEmptyCart
  }
`;

export const AddToCartMutation = gql`
  mutation addToCartMutation($cartId: String!, $cartItems: [CartItemInput!]!){
    addProductsToCart(
      cartId: $cartId
      cartItems: $cartItems
    ) {
      cart {
        ...CareItemFields
      }
    }
  }
  ${CartItemFields}
`;

export const MergeCartMutation = gql`
  mutation mergeCartMutation($srcCartId: String!, $cartId: String!){
    mergeCarts(
      source_cart_id: $srcCartId,
      destination_cart_id: $cartId
    ) {
      ...CareItemFields
    }
  }
  ${CartItemFields}
`;

export const CartQuery = gql`
  query cart($cartId: String!) {
    cart(cart_id: $cartId) {
      id, total_quantity,
      items {
        uid
        quantity
        product {
          url_key
          stock_status
          sku
        }
      }
    }
  }
`;

export const CustomerCartQuery = gql`
  query customerCart {
    customerCart {
      id, total_quantity,
      items {
        uid
        quantity
        product {
          url_key
          stock_status
          sku
        }
      }
    }
  }
`;

// export const SetShippingAddressOnCart = gql`
//   mutation setShippingAddressesOnCartMutation($input: AdditionalCartDataInput!) {
//     rzSetShippingAddressesOnCart(input: $input) {
//       cart {
//         ...CartDetailFields
//       }
//     }
//   }
//   ${CartDetailFields}
// `;

// Temporarly commented the above custom mutation while developing address book.
// On using that, getting error like below:
// Error:The shipping address cannot contain "customer_address_id"
// and "address" at the same time. So, took the default mutation.
export const SetShippingAddressOnCart = gql`
  mutation setShippingAddressesOnCart
  ($cart_id: String!, $shipping_addresses: [ShippingAddressInput!]!) {
    setShippingAddressesOnCart(
      input: {
        cart_id: $cart_id,
        shipping_addresses: $shipping_addresses,
      }
    ) {
      cart {
        ...CartDetailFields
      }
    }
  }
  ${CartDetailFields}
`;

export const CartDetailQuery = gql`
  query cartDetail($cartId: String!) {
    cart(cart_id: $cartId) {
      ...CartDetailFields
    }
  }
  ${CartDetailFields}
`;

export const CartMiniQuery = gql`
  query cartMini($cartId: String!) {
    cart(cart_id: $cartId) {
      ...CartMiniFields
    }
  }
  ${CartMiniFields}
`;

export const CustomerCartDetailQuery = gql`
  query customerCartDetail {
    customerCart {
      ...CartDetailFields
    }
  }
  ${CartDetailFields}
`;

export const CustomerCartMiniQuery = gql`
  query customerCartMini {
    customerCart {
      ...CartMiniFields
    }
  }
  ${CartMiniFields}
`;

export const SetShippingMethodGuestMutation = gql`
  mutation SetShippingGuestMethodMutation(
    $shippingAddres: AdditionalCartDataInput!,
    $billingAddres: SetBillingAddressOnCartInput!,
    $shippingMethod: SetShippingMethodsOnCartInput!,
    $email: SetGuestEmailOnCartInput!
  ) {
    rzSetShippingAddressesOnCart(input: $shippingAddres) { cart { id } }
    setBillingAddressOnCart(input: $billingAddres) { cart { id } }
    setShippingMethodsOnCart(input: $shippingMethod) { cart {
      id, 
      shipping_addresses {
        selected_shipping_method {
          amount {
            value, currency
          }
          carrier_code, carrier_title
          method_code, method_title
        }
      }
    } }
    setGuestEmailOnCart(input: $email) {
      cart {
        ...CartDetailFields
      }
    }
  }
  ${CartDetailFields}
`;

export const SetShippingMethodMutation = gql`
  mutation SetShippingMethodMutation(
    $shippingAddres: AdditionalCartDataInput!,
    $billingAddres: SetBillingAddressOnCartInput!,
    $shippingMethod: SetShippingMethodsOnCartInput!
  ) {
    rzSetShippingAddressesOnCart(input: $shippingAddres) { cart { id } }
    setBillingAddressOnCart(input: $billingAddres) { cart { id } }
    setShippingMethodsOnCart(input: $shippingMethod) { cart {
      id, 
      shipping_addresses {
        selected_shipping_method {
          amount {
            value, currency
          }
          carrier_code, carrier_title
          method_code, method_title
        }
      }
    } }
  }
`;

export const SetPaymentMethodMutation = gql`
  mutation setPaymentMethodMutation(
    $method: SetPaymentMethodOnCartInput!
  ) {
    setPaymentMethodOnCart (input: $method) { cart { id } }
  }
`;

export const PlaceOrderMutation = gql`
  mutation placeOrderMutation(
    $order: RzPlaceOrderInput!
  ) {
    rzPlaceOrder (input: $order) { order { order_number, order_id } }
  }
`;

export const SetPaymentMethodAndOrderMutation = gql`
  mutation setPaymentMethodAndOrderMutation(
    $payment: SetPaymentMethodOnCartInput!
    $order: RzPlaceOrderInput!
  ) {
    setPaymentMethodOnCart (input: $payment) { cart { id } }
    rzPlaceOrder (input: $order) { order { order_number, order_id } }
  }
`;

export const NetgiroTokenQuery = gql`
  query rzNetgiroToken($orderNumber: String!, $totalAmount: Int!) {
    rzNetgiroToken(order_number: $orderNumber, total_amount: $totalAmount) {
      action
      fields {
        ApplicationID
        Signature
        TotalAmount
        OrderId
        ClientInfo
      }
    }
  }
`;

export const PaymentCaptureNetgiroMutation = gql`
  mutation rzPaymentCaptureNetgiro($orderNumber: String!, $success: String!, $signature: String!) {
    rzPaymentCaptureNetgiro(
      orderid: $orderNumber,
      success: $success,
      signature: $signature
    ) {
      status
    }
  }
`;

export const RemoveFromCartMutation = gql`
  mutation removeFromCartMutation($cartId: String!, $cart_item_uid: ID!){
    removeItemFromCart(
      input: {
        cart_id: $cartId,
        cart_item_uid: $cart_item_uid
      }
    ) {
      cart {
        ...CareItemFields
      }
    }
  }
  ${CartItemFields}
`;

export const UpdateCartItemsMutation = gql`
  mutation updateCartItems($cartId: String!, $cartItems: [CartItemUpdateInput!]!){
    updateCartItems(
      input: {
        cart_id: $cartId,
        cart_items: $cartItems
      }
    ) {
      cart {
        ...CareItemFields
      }
    }
  }
  ${CartItemFields}
`;

export const PaymentSiminnOrderCreate = gql`
  mutation rzPaymentSiminnCreateOrder($orderNumber: String!) {
    rzPaymentSiminnCreateOrder(
      orderid: $orderNumber,
    ) {
      error
      orderKey
      message
      userMessage
    }
  }
`;

export const PaymentSiminnOrderStatus = gql`
  query rzSiminnOrderStatus($orderKey: String!) {
    rzSiminnOrderStatus(
      siminn_order_key: $orderKey,
    ) {
      error
      message
      userMessage
      statusAuthorized
      statusCanceled
      statusPending
    }
  }
`;

export const BorgunPaymentTokenQuery = gql`
  query rzBorgunToken($orderId: String!, $successUrl: String!) {
    rzBorgunToken(orderId: $orderId, successUrl: $successUrl) {
      action
      fields {
        merchantId
        paymentGatewayId
        checkHash
      }
    }
  }
`;

export const PaymentCaptureBorgunMutation = gql`
  mutation rzPaymentBorgunConfirmation($orderid: String!, $status: String!, $authorizationcode: String!, $orderhash: String!) {
    rzPaymentBorgunConfirmation(
      orderId: $orderid,
      status: $status,
      authorizationCode: $authorizationcode,
      orderHash: $orderhash
    ) {
      status
      borgunStatus
    }
  }
`;

export const PickupStores = gql`
  query getPickupStores($cartId: String!) {
    getPickupStores(cart_id: $cartId) {
      name
      code
      city
      street
      postcode
      description
      pickup_time_from
      pickup_time_to
    }
  }
`;

export const PickupStoresV2 = gql`
  query getPickupStoresV2(
    $skus: [String!]!
    $zipcode: String
    $quantity: Int!
  ) {
    getPickupStores: rzfPickupStores(
      skus: $skus,
      zipcode: $zipcode,
      quantity: $quantity,
    ) {
      name
      code
      description
      pickup_time_from
      pickup_time_to
    }
  }
`;

export const ApplyCouponToCartMutation = gql`
  mutation applyCouponToCartMutation($cart_id: String!, $coupon_code: String!){
    applyCouponToCart(
      input: {
        cart_id: $cart_id,
        coupon_code: $coupon_code
      }
    ) {
      cart {
        ...CareItemFields
      }
    }
  }
  ${CartItemFields}
`;

export const RemoveCouponToCartMutation = gql`
  mutation removeCouponToCartMutation($cart_id: String!){
    removeCouponFromCart(
      input: {
        cart_id: $cart_id
      }
    ) {
      cart {
        ...CareItemFields
      }
    }
  }
  ${CartItemFields}
`;

export const ShippingOptionsQuery = gql`
query getShippingOptionsQuery(
  $skus: [String!]!
  $zipcode: String
  $quantity: Int!
) {
  rzfShippingMethods(
    skus: $skus,
    zipcode: $zipcode,
    quantity: $quantity,
  ) {
    final {
      productMeta {
        sku
        volume
        assembleDays
      }
      methods {
        method {
          uid
          name
          description
          location {
            name
            stockCode
          }
          customerGroup
          mbcId
          price
        }
        deliveryDays {
          cutOffTimeIncluded
          assembleTimeIncluded
          weekendIncluded
          stock {
          store {
              name
              stockCode
              kind
              location { name, stockCode }
            }
            available
          }
          routingStoreStock {
            available
            store {
              name
              stockCode
              kind
              location {
                name
                stockCode
              }
            }
          }
          pickup {
            min
            max
          }
          delivery {
            min
            max
          }
        }
      } 
      warehouseRoute {
        stock {
          store {
            name
            stockCode
            kind
            location { name, stockCode }
          }
          available
        }
        days {
          min
          max
        }
      } 
      preferred {
        best {
          delivery {
            min
            max
          }
          pickup {
            min
            max
          }
          deliveryMethodUid
          pickupMethodUid
        } 
        wide {
          delivery {
            min
            max
          }
          pickup {
            min
            max
          }
          deliveryMethodUid
          pickupMethodUid
        } 
      }
    }
	}
}
`;
