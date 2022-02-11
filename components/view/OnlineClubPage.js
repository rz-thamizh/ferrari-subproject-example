import React from 'react';
import Head from 'next/head';
import { StoreConfigConsumer } from '@/store/core/context';

import { OnlineClubPageController } from '@/roanuz/controller/onlineClub/onlineClubPage';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/cart';

dependencyRegister();

const OnlineClubPage = () => {
  const pageTitle = 'Netklúbbur';

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
          <OnlineClubPageController />
        </div>
      )}
    </StoreConfigConsumer>
  );
};

OnlineClubPage.propTypes = {
};

export default OnlineClubPage;
