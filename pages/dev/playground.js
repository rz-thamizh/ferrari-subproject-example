/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Config from '@/config';
import styled from 'styled-components';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { asRem } from '@/roanuz/lib/css';
import { Display30 } from '@/roanuz/typopgraphy';
import { Button, ButtonList } from '@/roanuz/view/button';
import { StoreConfigConsumer, UserContext } from '@/store/core/context';
import { ProductSliderWithLoader } from '@/roanuz/controller/product/list';
import { PaymentMethod, buildSuccessUrl } from '@/roanuz/view/cart/payment/model';
import { AddToCart } from '@/roanuz/controller/product/addToCart';
import {
  SetShippingAddressOnCart,
  SetShippingMethodMutation,
  SetShippingMethodGuestMutation,
  SetPaymentMethodMutation,
  PlaceOrderMutation,
  BorgunPaymentTokenQuery,
  CartDetailQuery,
  CustomerCartDetailQuery,
  NetgiroTokenQuery,
} from '@/store/cart/query';
import { CustomerAddressesQuery, CustomerProfileMiniQuery } from '@/store/customer/query';
import { processBorgunPay } from '@/roanuz/controller/cart/payment/borgun';
import { processNetgiro } from '@/roanuz/controller/cart/payment/netgiro';
import { parseCart } from '@/roanuz/view/cart/model';
import { beforeOrderCreate, afterOrderCreate } from '@/roanuz/lib/cart';

const PlaygroundPageWrapper = styled.div`
  margin: ${asRem(50)};
  >.section-item {
    margin-bottom: ${asRem(20)};
  }
`;

export const PlaygroundPage = () => {
  // const defaultProductURL = 'samsung-galaxy-s21-ultra-512gb-phantom-silver';
  // const defaultSku = 'SAM-SMG998BZSHEUB';
  const defaultProductURL = 'stock-all-good';
  const defaultSku = 'stock-all-good';
  const defaultSSN = '1111111119';
  // const defaultPaymentMethod = 'netgiro';
  // const defaultPaymentMethod = 'checkmo';
  const defaultPaymentMethod = 'siminn_api';
  // const defaultPaymentMethod = 'borgunloanpayment';
  // const defaultPaymentMethod = 'borgun_gateway';
  // const defaultShippingMethod = 'posthus';
  const defaultShippingMethod = 'flatrate';
  const defaultShippingMethodCode = defaultShippingMethod;

  const router = useRouter();
  const userContext = useContext(UserContext);
  const [orderId, setOrderId] = useState();
  const [selectedAddress, setSelectedAddress] = useState();

  const cartKey = userContext.token ? 'customerCart' : 'cart';
  const {
    loading: cartLoading,
    error: cartError,
    data: cartData,
  } = useQuery(userContext.token ? CustomerCartDetailQuery : CartDetailQuery, {
    variables: { cartId: userContext.cartId },
    // ssr: false,
    skip: userContext.loaded && !userContext.cartId,
    fetchPolicy: 'network-only',
  });

  const {
    data: addressBookData,
  } = useQuery(CustomerAddressesQuery, {
    skip: !userContext.cartId,
  });

  const [
    showAddressSelection,
    setShowAddressSelection,
  ] = useState(false);
  const [productURL, setProductURL] = useState(defaultProductURL);
  const [sku, setSku] = useState(defaultSku);
  const [product, setProduct] = useState({
    url_key: defaultProductURL,
  });

  const { data: customerProfileData } = useQuery(CustomerProfileMiniQuery, {
    skip: !userContext.token,
  });

  const [
    getBorgunToken,
    { loading: borgunLoading, error: borgunError, data: borgunData },
  ] = useLazyQuery(BorgunPaymentTokenQuery, { fetchPolicy: 'no-cache' });

  const [
    getNetgiroToken,
    { loading: netgiroLoading, error: netgiroError, data: netgiroData },
  ] = useLazyQuery(NetgiroTokenQuery, { fetchPolicy: 'no-cache' });

  const [
    updateAddress,
    { error: updateAddressError, loading: updateAddressLoading },
  ] = useMutation(SetShippingAddressOnCart, {
    onCompleted: () => {
      console.log('⛹️‍♂️ Cart Address Updated');
    },
  });

  const shippingQuery = userContext.token
    ? SetShippingMethodMutation : SetShippingMethodGuestMutation;
  const [
    updateCartMethod,
    { error: updateError, loading: updateLoading },
  ] = useMutation(shippingQuery, {
    onCompleted: (resp) => {
      console.log('⛹️‍♂️ Cart Method Updated', resp);
    },
  });

  const [
    setPaymentMethod,
  ] = useMutation(SetPaymentMethodMutation, {
    onCompleted: (resp) => {
      console.log('⛹️‍♂️ Cart payment Updated', resp);
    },
  });

  const [
    placeOrderMutation,
  ] = useMutation(PlaceOrderMutation, {
    onCompleted: (resp) => {
      console.log('⛹️‍♂️ Place Order Done', resp);
      if (resp && resp.rzPlaceOrder) {
        afterOrderCreate(resp.rzPlaceOrder);
        setOrderId(resp.rzPlaceOrder.order.order_number);
      }
    },
  });

  const prepareCart = () => {
    const address = {
      firstname: 'Sherlock',
      lastname: 'Homes',
      company: 'The Great Game Inc',
      street: ['221 B, Backer Street'],
      postcode: '101',
      city: 'Reykjavík',
      telephone: '7000123',
      country_code: 'IS',
    };

    let addressPart = {};
    let businessAddressPart = {};
    let ssn = defaultSSN;
    if (selectedAddress && selectedAddress.id) {
      ssn = selectedAddress.rz_ssn;
      const addressId = selectedAddress.id ? parseInt(selectedAddress.id, 10) : null;
      addressPart = {
        customer_address_id: addressId,
      };
      businessAddressPart = {
        customer_address_id: addressId,
        same_as_shipping: true,
      };
    } else {
      addressPart = {
        address,
      };
      businessAddressPart = {
        address: {
          ...address,
          save_in_address_book: false,
        },
      };
    }

    const { cartId } = userContext;

    const input = {
      shippingAddres: {
        cart_id: cartId,
        ssn,
        shipping_addresses: [{
          address: { ...address },
        }],
      },
      billingAddres: {
        cart_id: cartId,
        billing_address: {
          ...businessAddressPart,
        },
      },
      shippingMethod: {
        cart_id: cartId,
        shipping_methods: [{
          method_code: defaultShippingMethod,
          carrier_code: defaultShippingMethodCode,
        }],
      },
    };

    if (!userContext.token) {
      input.email = {
        cart_id: cartId,
        email: 'sherlock@roanuz.com',
      };
    }

    updateCartMethod({ variables: input }).then(() => {
      console.log('Shipping Updated');
      const method = {
        method: {
          cart_id: userContext.cartId,
          payment_method: { code: defaultPaymentMethod },
        },
      };
      setPaymentMethod({ variables: method });
    });
  };

  useEffect(() => {
    if (addressBookData && addressBookData.customer) {
      if (addressBookData
        && addressBookData.customer
        && addressBookData.customer.addresses.length) {
        const address = addressBookData.customer.addresses[0];
        setShowAddressSelection(true);
        setSelectedAddress(address);
      }
    }
  }, [addressBookData]);

  useEffect(() => {
    if (borgunData) {
      processBorgunPay(
        borgunData.rzBorgunToken,
        orderId || '200001345',
        Config.PublicURL || router.basePath,
        parseCart(cartData[cartKey]),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    borgunLoading,
    borgunError,
    borgunData,
  ]);

  useEffect(() => {
    if (netgiroData) {
      processNetgiro(
        netgiroData.rzNetgiroToken,
        router.basePath,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    netgiroLoading,
    netgiroError,
    netgiroData,
  ]);

  const fetchURL = () => {
    setProduct({
      ...product,
      url_key: productURL,
    });
  };

  const onAdded = () => {
    prepareCart();
  };

  const doPrepareCart = () => {
    prepareCart();
  };

  const processBorgun = () => {
    getBorgunToken({
      variables: {
        orderId: orderId || '200001345',
        successUrl: buildSuccessUrl(
          Config.PublicURL || router.basePath, PaymentMethod.borgun_gateway.uid,
        ),
      },
    });
  };

  const processNetgiroMethod = () => {
    console.log('cartData', cartData);
    const total = Math.floor(cartData[cartKey].prices.grand_total.value);
    getNetgiroToken({
      variables: {
        orderNumber: orderId || '200001345',
        totalAmount: total,
      },
    });
  };

  const doPlaceOrder = () => {
    const input = {
      order: {
        cart_id: userContext.cartId,
        extension_attributes: {
          delivery_time_from: null,
          delivery_time_to: null,
          pickup_store: null,
          pickup_time_from: null,
          pickup_time_to: null,
          postbox_address: null,
          postbox_id: null,
          postbox_latitude: null,
          postbox_longitude: null,
          postbox_name: null,
          shipping_description: null,
          // ssn: parseInt(customerProfileData.customer.ssn || '', 10),
          ssn: 1111111119,
        },
      },
    };
    beforeOrderCreate(
      cartData[cartKey],
      { paymentMethod: defaultPaymentMethod },
      input.order.extension_attributes,
    );
    placeOrderMutation({ variables: input });
  };

  return (
    <PlaygroundPageWrapper>
      <StoreConfigConsumer>
        {() => (
          <>
            <div className="section-item">
              <Display30 as="h3">Product Card</Display30>
              <div className="control">
                <input
                  name="urlkey"
                  placeholder="URL Key"
                  type="text"
                  value={productURL}
                  onChange={(e) => setProductURL(e.target.value)}
                />
                <button
                  type="submit"
                  onClick={fetchURL}
                >
                  <span>Fetch</span>
                </button>
              </div>
            </div>
            <div className="section-item">
              <ProductSliderWithLoader
                products={[product]}
              />
            </div>
            <div className="section-item">
              <Display30 as="h3">Full Cart ops</Display30>
              <div>
                <input
                  name="sku"
                  placeholder="URL Key"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div>
                <ButtonList>
                  <AddToCart
                    buttonText="Add & Prepare Cart"
                    options={{}}
                    product={{
                      sku,
                      available: true,
                    }}
                    onProductAdded={onAdded}
                  />
                </ButtonList>
              </div>
            </div>
            <div className="section-item">
              <Display30 as="h3">Cart Ops</Display30>
              {orderId && (
                <p>
                  Order Id:
                  {orderId}
                </p>
              )}
              <ButtonList asList>
                <Button onClick={doPrepareCart}>Preare Cart</Button>
                <Button onClick={doPlaceOrder}>Place Order</Button>
                <Button onClick={processBorgun}>Process Borgun</Button>
                <Button onClick={processNetgiroMethod}>Process Netgiro</Button>
              </ButtonList>
            </div>

            <div className="section-item">
              <Display30 as="h3">Profile</Display30>
              <ButtonList>
                <Button onClick={prepareCart}>Create address</Button>
              </ButtonList>
            </div>

          </>
        )}
      </StoreConfigConsumer>
    </PlaygroundPageWrapper>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

PlaygroundPage.propTypes = {
};

export default PlaygroundPage;
