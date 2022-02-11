import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';

import { StoreConfigConsumer } from '@/store/core/context';
import { NewPasswordController } from '@/roanuz/controller/customer/newPassword';

const NewPasswordPageWrapper = styled.div`
`;

const NewPasswordPage = ({ token }) => {
  return (
    <StoreConfigConsumer>
      {() => (
        <NewPasswordPageWrapper>
          <Head>
            <title>
              Nýtt Lykilorð
            </title>
            <meta name="description" content="Nýtt Lykilorð" />
          </Head>
          <div>
            <NewPasswordController token={token} />
          </div>
        </NewPasswordPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

NewPasswordPage.propTypes = {
  token: PropTypes.string,
};

export default NewPasswordPage;
