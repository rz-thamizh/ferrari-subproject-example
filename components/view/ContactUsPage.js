import React from 'react';
import Head from 'next/head';
import { StoreConfigConsumer } from '@/store/core/context';

import { ContactUsPageController } from '@/roanuz/controller/contact/contactUsPage';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/cart';

dependencyRegister();

const ContactUsPage = () => {
  const pageTitle = 'Hafðu samband';

  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <Head>
            <title>
              {pageTitle}
            </title>
            <meta name="description" content={pageTitle} />
          </Head>
          <ContactUsPageController />
        </div>
      )}
    </StoreConfigConsumer>
  );
};

ContactUsPage.propTypes = {
};

export default ContactUsPage;
