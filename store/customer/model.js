import { formatMoney, formatDate } from '@/roanuz/lib/cart';
import { PaymentMethod } from '@/roanuz/view/cart/payment/model';
import { parseShippingMethodTax } from '@/roanuz/view/order/model';

export function parseOrder(raw, productUrlSuffix) {
  console.log('Order Raw', raw);
  const [order] = raw.customer.orders.items;
  const { email } = raw.customer;
  const { id, status } = order;
  const orderNumber = order.number;
  const date = order.order_date;
  const [paymentMethod] = order.payment_methods;
  const address = order.shipping_address;
  const rzSSN = order.rz_ssn;
  const shippingMethod = order.carrier;
  const shippingDescription = order.shipping_method;
  const { shipingMethodTaxCharge } = parseShippingMethodTax(order.total.taxes);
  const totalShippingTaxCharge = order.total.total_shipping.value + shipingMethodTaxCharge;
  const shippingRef = { ...order.total.total_shipping };
  shippingRef.value = totalShippingTaxCharge;
  const total = {
    shipping: shippingRef,
    tax: order.total.total_tax,
    total: order.total.grand_total,
    discounts: order.total.discounts,
    subtotal: order.total.subtotal,
    allTaxes: order.total.taxes,
  };

  const products = order.items.map((item) => {
    const productLink = `/${item.product_url_key}${productUrlSuffix}`;
    const itemWrap = { value: item.product_sale_price.value * item.quantity_ordered, currency: 'ISK' };
    const priceText = formatMoney(itemWrap);
    const product = {
      name: item.product_name,
      sku: item.product_sku,
      image: null,
      hasImage: false,
      productLink,
      priceText,
    };

    return {
      uid: item.id,
      quantity: item.quantity_ordered,
      options: [...item.selected_options, ...item.entered_options],
      product,
    };
  });

  return {
    id,
    status,
    email,
    orderNumber,
    date,
    paymentMethod,
    address,
    shippingMethod,
    total,
    products,
    shippingDescription,
    rzSSN,
  };
}

export function parseOrderFromCart(raw, partialOrder) {
  ///
  // This function is used for showing order from
  // recently placed order as Guest. Since there is no
  // API for fetching Guest user order, using the cart data
  // to build the order object.
  // This should be replaced with parseOrder when Guest user
  // Order API is ready.
  ///

  const { email } = raw;
  const {
    id, status, date, orderNumber,
  } = partialOrder;
  let { paymentMethod } = raw.paymentMethod;
  const paymentMethodName = PaymentMethod[paymentMethod].payment_title;
  paymentMethod = {};
  paymentMethod.name = paymentMethodName;
  paymentMethod.type = raw.paymentMethod.paymentMethod;

  const address = raw.shipping_addresses[0];
  const rzSSN = address.rz_ssn;
  const method = raw.shipping_addresses[0].selected_shipping_method;
  const shippingMethod = method.method_title;
  const { shippingDescription } = raw.extensionAttributes;
  const { extensionAttributes } = raw;
  const { shipingMethodTaxCharge } = parseShippingMethodTax(raw.prices.applied_taxes);
  const totalShippingTaxCharge = method.amount.value + shipingMethodTaxCharge;
  const shippingRef = { ...method.amount };
  shippingRef.value = totalShippingTaxCharge;
  const total = {
    shipping: shippingRef,
    tax: raw.prices.applied_taxes.length
      ? raw.prices.applied_taxes : { value: 0, currency: raw.prices.grand_total.currency },
    total: raw.prices.grand_total,
    discounts: raw.prices.discounts || [],
    subtotal: raw.prices.subtotal_excluding_tax,
    allTaxes: raw.prices.applied_taxes,
  };

  const products = raw.items.map((item) => {
    const { product, uid, quantity } = item;
    const { name, sku, thumbnail } = product;
    const image = thumbnail;
    const hasImage = (thumbnail && (thumbnail.disabled !== true));
    const productLink = `/${product.url_key}${product.url_suffix}`;
    const priceText = formatMoney(item.prices.row_total_including_tax);
    const productItem = {
      name,
      sku,
      image,
      hasImage,
      productLink,
      priceText,
    };

    return {
      uid,
      quantity,
      // options: [...item.selected_options, ...item.entered_options],
      product: productItem,
    };
  });

  return {
    id,
    status,
    email,
    orderNumber,
    date: formatDate(date),
    paymentMethod,
    address,
    shippingMethod,
    total,
    products,
    shippingDescription,
    extensionAttributes,
    rzSSN,
  };
}
