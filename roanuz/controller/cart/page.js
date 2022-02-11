import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import {
  SetShippingAddressOnCart,
  SetShippingMethodMutation,
  SetShippingMethodGuestMutation,
} from '@/store/cart/query';
import { CheckoutPageLayout } from '@/roanuz/layout/checkoutPage';
import { DisplayBold30, TextMedium16 } from '@/roanuz/typopgraphy';
import { ReactComponent as UserIcon } from '@/roanuz/view/imgs/UserIcon.svg';
import { WizardProgressView } from '@/roanuz/view/wizard';
import { Button } from '@/roanuz/view/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartSideView } from '@/roanuz/view/cart/side';
import { StepShippingMethodController } from '@/roanuz/controller/cart/stepShippingMethod';
import { StepPaymentMethodController } from '@/roanuz/controller/cart/stepPaymentMethod';
import {
  LocalOrderStorage,
  fetchUserLocalData,
  saveUserLocalData,
} from '@/roanuz/lib/cart';
import { UserContext, UserConsumer } from '@/store/core/context';
import { OrderSummaryModalView } from '@/roanuz/view/cart/orderSummaryModal';
import Config from '@/config';

export const CheckoutPageController = ({ cart }) => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [showPaymentMethod, setShowPaymentMethod] = useState();
  const isRetryPayment = router.query && router.query.isRetry;
  useEffect(() => {
    if (isRetryPayment) {
      setShowPaymentMethod(true);
    }
  }, [cart]);
  const wizardItems = [
    {
      text: 'Afhending',
      alt: 'Goto Step 1',
      future: false,
      completed: showPaymentMethod,
      onClick: () => setShowPaymentMethod(false),
    },
    {
      text: 'Yfirlit og greiðsla',
      href: '/checkout/step2',
      alt: 'Goto Step 1',
      future: !showPaymentMethod,
      completed: false,
    },
    // {
    //   text: 'Thank You',
    //   href: '/checkout/step3',
    //   alt: 'Goto Step 3',
    //   future: true,
    //   completed: false,
    // },
  ];

  const [
    updateAddress,
    { error: updateAddressError, loading: updateAddressLoading },
  ] = useMutation(SetShippingAddressOnCart, {
    onCompleted: () => {
      console.log('Cart Address Updated');
    },
  });

  const shippingQuery = userContext.token
    ? SetShippingMethodMutation : SetShippingMethodGuestMutation;
  const [
    updateCartMethod,
    { error: updateError, loading: updateLoading },
  ] = useMutation(shippingQuery, {
    onCompleted: () => {
      console.log('Cart Method Updated');
      setShowPaymentMethod(true);
    },
  });

  const [orderHandleStatus, setOrderHandleStatus] = useState({
    loading: false,
    completed: false,
    error: null,
    orderId: null,
    orderNumber: null,
  });

  const postBoxAttributesInitState = () => ({
    postboxId: fetchUserLocalData('postboxId', null),
    postboxName: fetchUserLocalData('postboxName', null),
    postboxAddress: fetchUserLocalData('postboxAddress', null),
    postboxLatitude: fetchUserLocalData('postboxLatitude', null),
    postboxLongitude: fetchUserLocalData('postboxLongitude', null),
  });

  const pickUpStoreAttributesInitState = () => ({
    pickupStore: fetchUserLocalData('pickupStore', null),
    pickupStoreCode: fetchUserLocalData('pickupStoreCode', null),
    pickupTimeFrom: fetchUserLocalData('pickupTimeFrom', null),
    pickupTimeTo: fetchUserLocalData('pickupTimeTo', null),
    pickupAddress: fetchUserLocalData('pickupAddress', null),
  });

  const deliveryAttributesInitState = () => ({
    deliveryTimeFrom: fetchUserLocalData('deliveryTimeFrom', null),
    deliveryTimeTo: fetchUserLocalData('deliveryTimeTo', null),
    shippingDescription: fetchUserLocalData('shippingDescription', null),
  });

  const [postBoxAttributes, setPostBoxAttributes] = useState({ ...postBoxAttributesInitState() });
  const [pickUpStoreAttributes,
    setPickUpStoreAttributes] = useState({ ...pickUpStoreAttributesInitState() });
  const [deliveryAttributes,
    setDeliveryAttributes] = useState({ ...deliveryAttributesInitState() });

  const postBoxAttributesHandler = (changes) => {
    const updates = {
      postboxId: changes.postboxId,
      postboxName: changes.name,
      postboxAddress: changes.address,
      postboxLatitude: changes.latitude,
      postboxLongitude: changes.longitude,
    };
    saveUserLocalData(updates, true);
    setPickUpStoreAttributes({ ...pickUpStoreAttributesInitState() });
    setPostBoxAttributes((state) => ({
      ...state,
      ...updates,
    }));
  };

  const pickUpStoreAttributesHandler = (changes) => {
    const updates = {
      pickupStore: changes.name,
      pickupStoreCode: changes.code,
      pickupTimeFrom: changes.pickup_time_from,
      pickupTimeTo: changes.pickup_time_to,
      pickupAddress: changes.description,
    };
    saveUserLocalData(updates, true);
    setPostBoxAttributes({ ...postBoxAttributesInitState() });
    setPickUpStoreAttributes((state) => ({
      ...state,
      ...updates,
    }));
  };

  const prepareExtensionAttributes = (input) => {
    const [selectedShippingMethod] = input.shippingMethod.shipping_methods;
    const selectedShippingMethodCode = selectedShippingMethod.method_code;
    if (selectedShippingMethodCode) {
      const matched = cart.availableShippingMethods
        .find((x) => x.method.code === selectedShippingMethodCode);
      const isStorePickup = selectedShippingMethodCode === 'storepickup';
      const isPostBox = Config.PostBoxMethodKeys.includes(selectedShippingMethodCode);
      const updates = {
        deliveryTimeFrom: isStorePickup ? null : matched.method.deliveryTimeFrom,
        deliveryTimeTo: isStorePickup ? null : matched.method.deliveryTimeTo,
        shippingDescription: matched.method.description,
      };
      setDeliveryAttributes((state) => ({
        ...state,
        ...updates,
      }));
      if (!isStorePickup) {
        const pickupUpdates = {
          pickupStore: null,
          pickupStoreCode: null,
          pickupTimeFrom: null,
          pickupTimeTo: null,
          pickupAddress: null,
        };
        saveUserLocalData(pickupUpdates);
        setPickUpStoreAttributes({ ...pickUpStoreAttributesInitState() });
      }
      if (!isPostBox) {
        const postboxUpdates = {
          postboxId: null,
          postboxName: null,
          postboxAddress: null,
          postboxLatitude: null,
          postboxLongitude: null,
        };
        saveUserLocalData(postboxUpdates);
        setPostBoxAttributes({ ...postBoxAttributesInitState() });
      }
      saveUserLocalData(updates);
    }
  };

  const extensionAttributes = {
    ...deliveryAttributes,
    ...pickUpStoreAttributes,
    ...postBoxAttributes,
  };

  useEffect(() => {
    LocalOrderStorage.store({
      id: orderHandleStatus.orderId,
      orderNumber: orderHandleStatus.orderNumber,
      date: new Date(),
      completed: orderHandleStatus.completed,
    });

    if (orderHandleStatus.completed) {
      console.log('Moving to order page', orderHandleStatus.completed, orderHandleStatus.orderId);
      // router.push('/customer/latest-order/');
      window.location.href = '/customer/latest-order/';
    }
  }, [orderHandleStatus.completed, orderHandleStatus.orderId]);

  const onShippingReqChange = (update) => {
    console.log('Updating Address', update);
    const input = { ...update };
    updateAddress({
      variables: input,
    });
  };

  const onShippingMethodReqSave = (update) => {
    console.log('Updating Cart Method', update);
    const input = { ...update };
    prepareExtensionAttributes(input);
    updateCartMethod({
      variables: { ...input },
    });
  };

  const onOrderHandleStatus = (status) => {
    setOrderHandleStatus({
      ...orderHandleStatus,
      ...status,
    });
  };

  const onEditShippingDetails = () => {
    setShowPaymentMethod(false);
  };

  return (
    <CheckoutPageLayout
      title={(
        <DisplayBold30>Pöntunarferli</DisplayBold30>
      )}
      titleLinksLeft={(
        <WizardProgressView items={wizardItems} />
      )}
      titleLinksRight={(
        !showPaymentMethod && (
          <UserConsumer>
            {({ token }) => (
              token
                ? (
                  <Link href="/customer/account" prefetch={false}>
                    <Button
                      icon={<UserIcon />}
                      mode="primary"
                      noborder
                      nomargin
                      ariaLabel="Mínar síður"
                    >
                      <TextMedium16>Mínar síður</TextMedium16>
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/customer/account/login?next=${router.asPath}`} prefetch={false}>
                    <Button
                      icon={<UserIcon />}
                      mode="primary"
                      noborder
                      nomargin
                      ariaLabel="Innskráning"
                    >
                      <TextMedium16>Innskráning</TextMedium16>
                    </Button>
                  </Link>
                )
            )}
          </UserConsumer>
        )
      )}
      content={(
        <>
          {showPaymentMethod && (
            <StepPaymentMethodController
              cart={cart}
              onOrderStatus={onOrderHandleStatus}
              extensionAttributes={extensionAttributes}
            />
          )}
          {!showPaymentMethod && (
            <StepShippingMethodController
              cart={cart}
              saving={updateAddressLoading || updateLoading}
              saveError={updateAddressError || updateError}
              onShippingReqChange={onShippingReqChange}
              onReqSave={onShippingMethodReqSave}
              postBoxAttributesHandler={postBoxAttributesHandler}
              pickUpStoreAttributesHandler={pickUpStoreAttributesHandler}
              postBoxAttributes={postBoxAttributes}
              pickUpStoreAttributes={pickUpStoreAttributes}
            />
          )}
        </>
      )}
      side={(
        <CartSideView
          cart={cart}
          showShipping={showPaymentMethod}
          onEditShippingDetails={onEditShippingDetails}
        />
      )}
      summaryBand={(
        <OrderSummaryModalView
          cart={cart}
          onEditShippingDetails={onEditShippingDetails}
          showPaymentMethod={showPaymentMethod}
        />
      )}
    />
  );
};

CheckoutPageController.propTypes = {
  cart: PropTypes.object.isRequired,
};
