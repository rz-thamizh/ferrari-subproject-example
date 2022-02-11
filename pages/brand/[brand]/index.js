import React from 'react';
import Config from '@/config';
import { useRouter } from 'next/router';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

import {
  LayoutContainer,
} from '@/store/layout/layout';

import { StoreConfigConsumer } from '@/store/core/context';
import { BrandPage as BrandPageController } from '@/roanuz/page/brand';

export const BrandPage = () => {
  const router = useRouter();
  const { brand } = router.query;
  if (!brand) { return null; }
  return (
    <StoreConfigConsumer>
      {({
        storeConfig,
        storeWidgets,
        defaultWidgets,
        categoryTreeData,
      }) => (
        <div>
          <main>
            <BrandPageController
              brand={brand}
              widgets={storeWidgets}
              storeConfig={storeConfig}
              categoryTreeData={categoryTreeData}
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

BrandPage.propTypes = {
};

export default BrandPage;
