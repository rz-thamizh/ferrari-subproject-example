import Config from '@/config';
import { formatCurrency, formatNumber } from '../../lib/cart';
import { parseShippingMethodTax } from '../order/model';
import { prepareGalleryData } from '../product/model';

export const InputMask = '-';

export function replaceMask(value) {
  if (value === InputMask) {
    return '';
  }

  return value;
}

export function applyMask(value) {
  return value || InputMask;
}

export function applySSNMask(value) {
  return value.trim().replace('-', '').replace(' ', '');
}

export function buildMethodValue(method) {
  return `${method.method_code}:::${method.carrier_code}`;
}

export function extracMethodValue(value) {
  // eslint-disable-next-line camelcase
  const [method_code, carrier_code] = value.split(':::');
  return { method_code, carrier_code };
}

export function parseCart(cart, isB2B, allowInvoice) {
  // In some cases - an invalid product is in cart
  // which causes prices to be null
  const prices = (cart.prices) ? cart.prices : {
    grand_total: { value: 0, currency: Config.Currency },
  };
  const hasError = cart.prices != null;
  const grandTotal = prices.grand_total;
  const grandTotalPriceText = formatCurrency(grandTotal.value, grandTotal.currency);
  const productItems = [];
  let shippingCharge = null;
  let shippingChargeText = null;
  let shippingAddress = null;
  let shippingAddresses = [];
  let shippingAddressFullfilled = false;
  let defaultAddressId = null;
  let shippingMethod = null;
  let discounts = [];
  let appliedCoupons = [];
  let availableShippingMethods = [];
  let paymentMethod = null;
  let availablePaymentMethods = [];
  let shipingMethodTaxCharge = null;

  if (cart.shipping_addresses && cart.shipping_addresses.length > 0) {
    shippingAddresses = cart.shipping_addresses;
    [shippingAddress] = cart.shipping_addresses;
    defaultAddressId = shippingAddress.rz_uid;
    if (shippingAddress.selected_shipping_method) {
      shippingMethod = {
        code: shippingAddress.selected_shipping_method.method_code,
        title: shippingAddress.selected_shipping_method.method_title,
        value: buildMethodValue(shippingAddress.selected_shipping_method),
      };

      shippingCharge = shippingAddress.selected_shipping_method.amount;
      shipingMethodTaxCharge = parseShippingMethodTax(cart.prices.applied_taxes)
        .shipingMethodTaxCharge;
      const totalShippingTaxCharge = shippingCharge.value + shipingMethodTaxCharge;
      shippingChargeText = formatCurrency(totalShippingTaxCharge, shippingCharge.currency);
    }

    if (cart.email
      && shippingAddress.ssn
      && shippingAddress.firstname
      && shippingAddress.street
      && shippingAddress.postcode
      && shippingAddress.telephone
    ) {
      shippingAddressFullfilled = true;
    }

    if (shippingAddress.available_shipping_methods
      && shippingAddress.available_shipping_methods.length > 0) {
      availableShippingMethods = shippingAddress.available_shipping_methods.map((method) => ({
        amount: method.amount,
        priceText: formatCurrency(method.amount.value, method.amount.currency),
        method: {
          uid: buildMethodValue(method),
          value: buildMethodValue(method),
          code: method.method_code,
          carrierCode: method.carrier_code,
          title: method.method_title,
          deliveryTimeFrom: method.delivery_time_from,
          deliveryTimeTo: method.delivery_time_to,
          description: method.description,
        },
      }));

      const matchingPrefix = 'B2B_';

      if (isB2B) {
        const b2bMethods = availableShippingMethods
          .filter((x) => x.method.code.startsWith(matchingPrefix))
          .map((x) => x.method.code.substring(matchingPrefix.length));

        availableShippingMethods = availableShippingMethods
          .filter((x) => b2bMethods.indexOf(x.method.code) < 0);
      } else {
        availableShippingMethods = availableShippingMethods
          .filter((x) => !x.method.code.startsWith(matchingPrefix));
      }

      availableShippingMethods.sort((x, y) => x.amount.value - y.amount.value);

      // Remove duplicate
      const filteredShippingMethods = [];
      const matchedCodes = {};
      availableShippingMethods.forEach((method) => {
        if (matchedCodes[method.method.code]) {
          return;
        }
        matchedCodes[method.method.code] = true;
        filteredShippingMethods.push(method);
      });

      availableShippingMethods = filteredShippingMethods;
    }
  }

  if (cart.available_payment_methods && cart.available_payment_methods.length > 0) {
    availablePaymentMethods = cart.available_payment_methods;

    if (!allowInvoice) {
      availablePaymentMethods = availablePaymentMethods
        .filter((x) => !Config.RestrictedPaymentMethods.includes(x.code));
    }
  }

  if (cart.selected_payment_method && cart.selected_payment_method.code) {
    paymentMethod = cart.selected_payment_method;
  }

  if (prices.discounts && prices.discounts.length > 0) {
    const filtered = prices.discounts.filter((x) => x.amount.value > 0);
    discounts = filtered.map((item, i) => ({
      ...item,
      uid: i,
      priceText: formatCurrency(item.amount.value, item.amount.currency),
    }));
  }

  cart.items.forEach((item) => {
    if (!item) {
      // In some cases - an invalid product is in cart
      // which causes item to be null
      return;
    }

    const { product, uid, quantity } = item;
    const {
      name,
      sku,
      thumbnail,
      rz_gallery_meta,
    } = product;
    const image = thumbnail;
    const hasImage = (thumbnail && (thumbnail.disabled !== true));
    const productLink = `/${product.url_key}${product.url_suffix}`;
    const price = item.prices.row_total_including_tax;
    const priceText = formatCurrency(price.value, price.currency);
    const quantityText = `Magn ${formatNumber(quantity)}`;
    // if (quantity > 1) {
    //   priceText = `${formatNumber(quantity)} x ${priceText}`;
    // }
    const productItem = {
      name,
      sku,
      image,
      hasImage,
      productLink,
      priceText,
      quantityText,
      rz_gallery_meta,
    };
    productItem.gallery = prepareGalleryData(productItem);

    productItems.push({
      uid,
      quantity,
      product: productItem,
    });
  });

  if (cart.applied_coupons) {
    appliedCoupons = cart.applied_coupons.map((x, i) => ({ code: x.code, uid: i }));
  }
  return {
    ...cart,
    hasError,
    grandTotalPriceText,
    shippingAddresses,
    shippingAddress,
    shippingCharge,
    shippingChargeText,
    shippingAddressFullfilled,
    defaultAddressId,
    shippingMethod,
    discounts,
    appliedCoupons,
    availableShippingMethods,
    availablePaymentMethods,
    paymentMethod,
    items: productItems,
    raw: cart,
    shipingMethodTaxCharge,
  };
}

export function getShippingCalcInput(cart) {
  const data = {
    zipcode: null,
    quantity: cart.total_quantity,
    skus: cart.items.map((x) => x.product.sku),
  };

  if (cart.shipping_addresses.length > 0) {
    data.zipcode = cart.shipping_addresses.postcode;
  }

  return data;
}
