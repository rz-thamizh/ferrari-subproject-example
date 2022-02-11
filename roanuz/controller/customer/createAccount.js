import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { CreateAccountView } from '@/roanuz/view/customer/createAccount';
import { CreateCustomerMuation } from '@/store/customer/query';
import { useCustomerNewSessoin } from '@/store/customer/customer';

const CreateAccountControllerWrapper = styled.div`
  @media screen and (min-width: ${Breakpoint.sm}) {
    max-width: ${asRem(1024)};
    margin: auto;      
    padding-top: ${asRem(20)};
  }
`;

export const CreateAccountController = ({
  nextUrl,
  nextRoutePath,
  nextRouteParams,
}) => {
  const [saving, setSaving] = useState(false);
  const [
    handleNewSession,
    { loading: sessionLoding, error: sessionError },
  ] = useCustomerNewSessoin({ nextRoutePath, nextRouteParams, nextUrl });

  useEffect(() => {
    setSaving(sessionLoding);
  }, [sessionLoding]);

  const [createCustomer, { error }] = useMutation(CreateCustomerMuation, {
    onCompleted: (data) => {
      // Ensure customer is created
      if (data.createCustomerV2) {
        console.log('✅ Customer created', data.createCustomerV2, error);
        handleNewSession(data.generateCustomerToken.token);
      } else {
        setSaving(false);
      }
    },
  });

  const onSave = (variables) => {
    setSaving(true);
    createCustomer({ variables });
  };

  return (
    <CreateAccountControllerWrapper>
      <CreateAccountView
        onSave={onSave}
        saving={saving}
        saveError={error || sessionError}
      />
    </CreateAccountControllerWrapper>
  );
};

CreateAccountController.propTypes = {
  nextUrl: PropTypes.string,
  nextRoutePath: PropTypes.string,
  nextRouteParams: PropTypes.object,
};
