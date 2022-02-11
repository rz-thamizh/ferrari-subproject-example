import BorgunImage from '@/roanuz/view/imgs/PaymentMethodBorgun.png';
import NetgiroImage from '@/roanuz/view/imgs/PaymentMethodNetgiro.png';
import InvoiceImage from '@/roanuz/view/imgs/PaymentMethodInvoice.png';
import SiminnImage from '@/roanuz/view/imgs/PaymentMethodSimminLett.png';
import BorgunLoanImage from '@/roanuz/view/imgs/PaymentMethodBorgunLoan.png';
import PaymentMethodMillifaerslaImage from '@/roanuz/view/imgs/PaymentMethodMillifaersla.png';
import { applySSNMask } from '../model';

export const PaymentMethod = {
  borgun_gateway: {
    isBorgunPay: true,
    image: BorgunImage,
    uid: 'borgun',
    payment_title: 'Greiða með korti',
  },
  netgiro: {
    isNetgiro: true,
    image: NetgiroImage,
    uid: 'netgiro',
    payment_title: 'Netgíró',
  },
  checkmo: {
    isInvoice: true,
    image: PaymentMethodMillifaerslaImage,
    uid: 'invoice',
    payment_title: 'Millifærsla',
  },
  siminn_api: {
    isSiminn: true,
    image: SiminnImage,
    uid: 'siminn',
    payment_title: 'Siminn',
  },
  borgunloanpayment: {
    isBorgunLoan: true,
    image: BorgunLoanImage,
    uid: 'borgunloanpayment',
    payment_title: 'Raðgreiðslur Borgunar',
  },
  // banktransfer: {
  //   isBankTransfer: true,
  //   image: InvoiceImage,
  //   uid: 'banktransfer',
  //   payment_title: 'Setja í reikning',
  // },
  purchaseorder: {
    isPurchaseOrder: true,
    image: InvoiceImage,
    uid: 'purchaseorder',
    payment_title: 'Setja í reikning',
  },
};

function guidGenerator() {
  const S4 = () => {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
}

export function buildCreateOrderInput(cart, values, shippingInfo) {
  return {
    payment: {
      cart_id: cart.id,
      payment_method: { code: values.paymentMethod, purchase_order_number: guidGenerator() },
    },
    order: {
      cart_id: cart.id,
      extension_attributes: {
        ssn: applySSNMask(cart.shippingAddress.rz_ssn),
        postbox_id: shippingInfo.postboxId,
        postbox_name: shippingInfo.postboxName,
        postbox_address: shippingInfo.postboxAddress,
        postbox_latitude: shippingInfo.postboxLatitude,
        postbox_longitude: shippingInfo.postboxLongitude,
        delivery_time_from: shippingInfo.deliveryTimeFrom,
        delivery_time_to: shippingInfo.deliveryTimeTo,
        pickup_store: shippingInfo.pickupStore,
        pickup_store_code: shippingInfo.pickupStoreCode,
        pickup_address: shippingInfo.pickupAddress,
        // Till we fix it to init in fetching getPickUpStores - Backend
        pickup_time_from: parseInt(shippingInfo.pickupTimeFrom, 10),
        pickup_time_to: parseInt(shippingInfo.pickupTimeTo, 10),
        shipping_description: shippingInfo.shippingDescription,
        shipment_title: (cart.shippingAddress.selected_shipping_method
          && cart.shippingAddress.selected_shipping_method.method_title)
          || null,
      },
    },
  };
}

export function buildSuccessUrl(baseUrl, method) {
  let resolvedUrl = baseUrl;
  if (!resolvedUrl) {
    const parts = window.location.href.split('://');
    const host = parts[1].split('/')[0];
    resolvedUrl = `${parts[0]}://${host}`;
  }
  return `${resolvedUrl}/customer/payment-response/${method}/`;
}
