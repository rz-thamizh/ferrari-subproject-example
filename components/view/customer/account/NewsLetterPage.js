import React from 'react';
import styled from 'styled-components';
import { StoreConfigConsumer } from '@/store/core/context';
import { NewsLetterController } from '@/roanuz/controller/customer/newsLetter';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';

const NewsLetterPageWrapper = styled.div`
`;

const NewsLetterPage = () => {
  return (
    <StoreConfigConsumer>
      {() => (
        <NewsLetterPageWrapper>
          <MyAccountPageLayout
            pageTitle="Póstlistaskráningar"
            title="Póstlistaskráningar"
          >
            <NewsLetterController />
          </MyAccountPageLayout>
        </NewsLetterPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

NewsLetterPage.propTypes = {
};

export default NewsLetterPage;
