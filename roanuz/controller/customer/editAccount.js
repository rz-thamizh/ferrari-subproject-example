import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { EditAccountView } from '@/roanuz/view/customer/editAccount';
import { UpdateCustomerMuation, UpdateCustomerPasswordMuation, CustomerProfileMiniQuery } from '@/store/customer/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const EditAccountControllerWrapper = styled.div`
  width: 100%;
  padding: ${asRem(20)} 0;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }
`;

export const EditAccountController = () => {
  const { data, loading, error: queryError } = useQuery(CustomerProfileMiniQuery);

  const customerdata = data && data.customer;

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [updateCustomer, { error }] = useMutation(UpdateCustomerMuation, {
    onCompleted: (updatedData) => {
      // Ensure customer data is updated
      if (updatedData) {
        console.log('✅ Customer data updated', updatedData, error);
      } else {
        setSaving(false);
      }
    },
  });

  const [updateCustomerPassword, { error: updatePasswordError }] = useMutation(
    UpdateCustomerPasswordMuation,
    {
      onCompleted: (updatedData) => {
        // Ensure customer data is updated
        if (updatedData) {
          console.log('✅ Customer password updated', updatedData, updatePasswordError);
        } else {
          setSavingPassword(false);
        }
      },
    },
  );

  const onSave = (variables) => {
    setSaving(true);
    updateCustomer({ variables });
    setSaving(false);
  };

  const onSavePassword = (variables) => {
    setSavingPassword(true);
    updateCustomerPassword({ variables });
    setSavingPassword(false);
  };

  return (
    <EditAccountControllerWrapper>
      { loading && (<PageLoadingView message="Hleð.. vinsamlegast bíðið" />) }
      { queryError && (<PageErrorView error={queryError} />) }
      { data && (
        <EditAccountView
          onSave={onSave}
          onSavePassword={onSavePassword}
          saving={saving}
          savingPassword={savingPassword}
          saveError={error}
          updatePasswordError={updatePasswordError}
          data={customerdata}
        />
      )}
    </EditAccountControllerWrapper>
  );
};

EditAccountController.propTypes = {
};
