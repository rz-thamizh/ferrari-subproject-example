import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '@/store/core/context';
import { DeliveryPickupView } from '@/roanuz/view/product/deliveryPickupView';
import { useQuery } from '@apollo/client';
import { productDeliveryPickupAssemblyTimes, productDeliveryPickupAssemblyTimesV2 } from '@/store/product/product.graphql';
import { CustomerAddressesQuery } from '@/store/customer/query';
import Config from '@/config';

export const DeliveryPickupController = ({ product }) => {
  const userContext = useContext(UserContext);
  const { loading: customerDefaultAddressLoading, data: customerDefaultAddress } = useQuery(
    CustomerAddressesQuery, {
      skip: !userContext.token,
    },
  );

  const defaultAddressPinCode = customerDefaultAddress
  && customerDefaultAddress.customer
  && customerDefaultAddress.customer.addresses.find((i) => i.default_shipping);

  const postCode = (defaultAddressPinCode && defaultAddressPinCode.postcode) || null;

  const { loading: pickupLoading, data, error } = useQuery(
    Config.Features.EnableDatoCMS
      ? productDeliveryPickupAssemblyTimesV2
      : productDeliveryPickupAssemblyTimes,
    {
      variables: { productSKU: product.sku, postCode },
      skip: (userContext.token && !userContext.loaded),
    },
  );

  const loading = customerDefaultAddressLoading || pickupLoading;
  if (error) {
    console.log('Error loading Siminn Loan Options', error);
    return null;
  }

  let deliveryPickupTimes = {};
  if (data) {
    deliveryPickupTimes = data.productDeliveryPickupAssemblyTimes;
  }

  return (
    <DeliveryPickupView
      loading={loading}
      deliveryPickupTimes={deliveryPickupTimes}
    />
  );
};

DeliveryPickupController.propTypes = {
  product: PropTypes.object.isRequired,
};
