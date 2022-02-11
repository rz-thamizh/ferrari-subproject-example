import React from 'react';
import Head from 'next/head';
import { StoreConfigConsumer } from '@/store/core/context';

import { BrandListPageController } from '@/roanuz/controller/brandList/brandListPage';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/product';

dependencyRegister();

const BrandListPage = () => {
  const pageTitle = 'Vörumerki';

  return (
    <StoreConfigConsumer>
      {({
        attributeMeta,
      }) => (
        <div>
          <Head>
            <title>
              {pageTitle}
            </title>
            <meta name="description" content={pageTitle} />
          </Head>
          <BrandListPageController attributeMeta={attributeMeta} />
        </div>
      )}
    </StoreConfigConsumer>
  );
};

export default BrandListPage;
