import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { useMutation } from '@apollo/client';
import { ResetPasswordMutation } from '@/store/customer/query';
import { NewPasswordView } from '@/roanuz/view/customer/newPassword';
import { DailogView } from '@/roanuz/view/dialog';
import {
  Text16,
} from '@/roanuz/typopgraphy';
import { useRouter } from 'next/router';

const NewPasswordControllerWrapper = styled.div`
 @media screen and (min-width: ${Breakpoint.sm}) {
    max-width: ${asRem(480)};
    margin: auto;      
    padding-top: ${asRem(20)};
  }
`;

export const NewPasswordController = ({ token }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [resetPassword, { error }] = useMutation(ResetPasswordMutation, {
    onCompleted: (data) => {
      if (data && data.resetPassword) {
        console.log('✅ Password changed successfully');
        setSuccessModal(true);
        setSaving(false);
        router.push({
          pathname: '/customer/account/login/',
        });
      } else {
        setSaving(false);
      }
    },
  });
  const onSetNewPassword = (formData) => {
    setSaving(true);
    const variables = {
      // The below email and token should be captured from url query
      // FYI "https://<MAGENTOSITE>/customer/account/createPassword/?token=XXXXXX" - is the URL
      // which magento returns. We need to use the value of the token in the resetPassword mutation.

      // So, I requested backend team to edit "Reset Password Link" email template
      // in such a way that need the domain as frontned app domain instead of backend
      // and also requested them to give the email along with token.
      // email: '', // For now we added email field.
      resetPasswordToken: token,
      ...formData,
    };
    resetPassword({ variables });
  };
  return (
    <NewPasswordControllerWrapper>
      <DailogView
        titleText="Lykilorð uppfært"
        showClose
        onClose={() => setSuccessModal(false)}
        show={successModal}
        containerWidth="400px"
      >
        <Text16>Lykilorðið hefur verið uppfært</Text16>
      </DailogView>
      <NewPasswordView
        onSetNewPassword={onSetNewPassword}
        saving={saving}
        saveError={error}
      />
    </NewPasswordControllerWrapper>
  );
};

NewPasswordController.propTypes = {
  token: PropTypes.string,
};
