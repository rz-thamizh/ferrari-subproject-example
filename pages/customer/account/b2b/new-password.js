import React from 'react';
import { RegisterPage } from '../reset-password';

export const B2bRegisterPage = () => {
  return (
    <RegisterPage isB2b />
  );
};

B2bRegisterPage.propTypes = {
};

export async function getServerSideProps() {
  return { props: {} };
}

export default B2bRegisterPage;
