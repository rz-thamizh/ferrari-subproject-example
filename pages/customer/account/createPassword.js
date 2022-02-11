import React from 'react';
import PropTypes from 'prop-types';
import { shouldRedirectForForgetPassword } from '@/store/core/context';
import NewPasswordPage from '@/components/view/customer/account/NewPasswordPage';

export const RegisterPage = ({ token }) => {
  return (
    <NewPasswordPage token={token} />
  );
};

RegisterPage.propTypes = {
  token: PropTypes.string,
};

export async function getServerSideProps({ query }) {
  const redirect = await shouldRedirectForForgetPassword({ query });
  if (redirect) {
    return redirect;
  }
  return { props: { token: query.token || null } };
}

export default RegisterPage;
