import React, { useState } from 'react';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { useMutation } from '@apollo/client';
import { RequestPasswordResetEmailMutation } from '@/store/customer/query';
import { ResetPasswordView } from '@/roanuz/view/customer/resetPassword';
import { DailogView } from '@/roanuz/view/dialog';
import {
  Text16,
} from '@/roanuz/typopgraphy';
import PropTypes from 'prop-types';

const ResetPasswordControllerWrapper = styled.div`
 @media screen and (min-width: ${Breakpoint.sm}) {
    max-width: ${asRem(480)};
    margin: auto;      
    padding-top: ${asRem(20)};
  }
`;

export const ResetPasswordController = ({ isB2bCustomer }) => {
  const [saving, setSaving] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [requestPasswordResetEmail, { error }] = useMutation(RequestPasswordResetEmailMutation, {
    onCompleted: (data) => {
      if (data && data.requestPasswordResetEmail) {
        console.log('✅ Email has been sent');
        setSuccessModal(true);
        setSaving(false);
      } else {
        setSaving(false);
      }
    },
  });
  const onResetPassword = async (variables) => {
    setSaving(true);
    await requestPasswordResetEmail({ variables });
  };
  return (
    <ResetPasswordControllerWrapper>
      <DailogView
        titleText="Tölvupóstur sendur"
        showClose
        onClose={() => setSuccessModal(false)}
        show={successModal}
        containerWidth="400px"
      >
        <Text16>Við höfum sent þér hlekk í tölvupósti til að endurstilla lykilorðið þitt</Text16>
      </DailogView>
      <ResetPasswordView
        onResetPassword={onResetPassword}
        saving={saving}
        saveError={error}
        isB2bCustomer={isB2bCustomer}
      />
    </ResetPasswordControllerWrapper>
  );
};

ResetPasswordController.propTypes = {
  isB2bCustomer: PropTypes.bool,
};
