import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { NewAddressView } from '@/roanuz/view/customer/newAddress';
import { CustomerAddressesQuery, CreateCustomerAddressMutation } from '@/store/customer/query';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import Router from 'next/router';

const NewAddressControllerWrapper = styled.div`
  width: 100%;
  padding: ${asRem(20)} 0;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }
`;

export const NewAddressController = () => {
  const [saving, setSaving] = useState(false);

  const [createCustomer, { error }] = useMutation(CreateCustomerAddressMutation, {
    onCompleted: (createdData) => {
      // Ensure customer data is created
      if (createdData) {
        console.log('✅ Customer Address created', createdData, error);
        Router.push('/customer/account/address');
      } else {
        setSaving(false);
      }
    },
    refetchQueries: [{ query: CustomerAddressesQuery }],
  });

  const onSave = (variables) => {
    setSaving(true);
    createCustomer({ variables });
    setSaving(false);
  };

  return (
    <NewAddressControllerWrapper>
      <NewAddressView
        onSave={onSave}
        saving={saving}
        saveError={error}
      />
    </NewAddressControllerWrapper>
  );
};

NewAddressController.propTypes = {
};
