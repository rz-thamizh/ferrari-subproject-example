import React from 'react';
import Config from '@/config';
import { useRouter } from 'next/router';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

import {
  LayoutContainer,
} from '@/store/layout/layout';

import { StoreConfigConsumer } from '@/store/core/context';
import { BrandProductsPage as BrandProductsPageController } from '@/roanuz/page/brandProducts';

export const BrandProductsPage = () => {
  const router = useRouter();
  const { brand, categoryId } = router.query;
  if (!brand) { return null; }
  return (
    <StoreConfigConsumer>
      {({
        storeConfig,
        storeWidgets,
        defaultWidgets,
      }) => (
        <div>
          <main>
            <BrandProductsPageController
              brand={brand}
              categoryId={categoryId}
              widgets={storeWidgets}
              storeConfig={storeConfig}
            />
          </main>

          <footer>
            <ContainerWidgets
              widgets={defaultWidgets}
              container={LayoutContainer.FooterLinks}
            />
          </footer>
        </div>
      )}
    </StoreConfigConsumer>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  return { props: { }, revalidate: Config.PageCacheSeconds };
}

BrandProductsPage.propTypes = {
};

export default BrandProductsPage;
