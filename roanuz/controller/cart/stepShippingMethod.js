import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CustomerAddressesQuery, CustomerProfileMiniQuery } from '@/store/customer/query';
import { UserContext } from '@/store/core/context';
import { useQuery } from '@apollo/client';
import { StepShippingMethodView } from '@/roanuz/view/cart/stepShippingMethod';

const StepShippingMethodControllerWrapper = styled.div`
`;

export const StepShippingMethodController = ({
  cart,
  onShippingReqChange,
  onReqSave,
  saving,
  saveError,
  postBoxAttributesHandler,
  pickUpStoreAttributesHandler,
  postBoxAttributes,
  pickUpStoreAttributes,
}) => {
  const userContext = useContext(UserContext);
  const {
    data: addressBookData,
  } = useQuery(CustomerAddressesQuery, {
    variables: { cartId: userContext.cartId },
    ssr: false,
    skip: !userContext.cartId,
    fetchPolicy: 'network-only',
  });

  const [
    showAddressSelection,
    setShowAddressSelection,
  ] = useState(false);

  // To auto fill the profile data for resistered customers.
  const { data: customerProfileData } = useQuery(CustomerProfileMiniQuery, {
    skip: !userContext.token,
  });

  useEffect(() => {
    if (addressBookData && addressBookData.customer) {
      setShowAddressSelection(!!(addressBookData
        && addressBookData.customer && addressBookData.customer.addresses.length));
    }
  }, [addressBookData]);

  return (
    <StepShippingMethodControllerWrapper>
      <StepShippingMethodView
        cart={cart}
        onShippingReqChange={onShippingReqChange}
        onReqSave={onReqSave}
        saving={saving}
        saveError={saveError}
        showAddressSelection={showAddressSelection}
        addresses={
          showAddressSelection && addressBookData && addressBookData.customer.addresses
        }
        onNewAddressSelect={() => setShowAddressSelection(false)}
        postBoxAttributesHandler={postBoxAttributesHandler}
        pickUpStoreAttributesHandler={pickUpStoreAttributesHandler}
        postBoxAttributes={postBoxAttributes}
        pickUpStoreAttributes={pickUpStoreAttributes}
        userDetails={customerProfileData}
        isGuestUser={!userContext.token}
      />
    </StepShippingMethodControllerWrapper>
  );
};

StepShippingMethodController.propTypes = {
  cart: PropTypes.object.isRequired,
  onShippingReqChange: PropTypes.func,
  onReqSave: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  postBoxAttributesHandler: PropTypes.func,
  pickUpStoreAttributesHandler: PropTypes.func,
  postBoxAttributes: PropTypes.object,
  pickUpStoreAttributes: PropTypes.object,
};
