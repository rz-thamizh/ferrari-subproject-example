import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { useMutation } from '@apollo/client';
import { LoginAccountView } from '@/roanuz/view/customer/loginAccount';
import { CustomerTokenMutation } from '@/store/customer/query';
import { useCustomerNewSessoin } from '@/store/customer/customer';

const LoginAccountControllerWrapper = styled.div`
 @media screen and (min-width: ${Breakpoint.sm}) {
    max-width: ${asRem(1024)};
    margin: auto;      
    padding-top: ${asRem(20)};
  }
`;

export const LoginAccountController = ({
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

  const [createToken, { error }] = useMutation(CustomerTokenMutation, {
    onCompleted: (data) => {
      if (data.generateCustomerToken) {
        console.log('✅ Customer Login');
        handleNewSession(data.generateCustomerToken.token);
      } else {
        setSaving(false);
      }
    },
  });

  const onSave = (variables) => {
    setSaving(true);
    createToken({ variables });
  };

  return (
    <LoginAccountControllerWrapper>
      <LoginAccountView
        onSave={onSave}
        saving={saving}
        saveError={error || sessionError}
      />
    </LoginAccountControllerWrapper>
  );
};

LoginAccountController.propTypes = {
  nextUrl: PropTypes.string,
  nextRoutePath: PropTypes.string,
  nextRouteParams: PropTypes.object,
};
