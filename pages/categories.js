import React from 'react';
import Config from '@/config';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

import {
  LayoutContainer,
} from '@/store/layout/layout';

import { StoreConfigConsumer } from '@/store/core/context';
import RootCategoryPage from '@/components/view/RootCategoryPage';

export const CategoryPage = () => {
  return (
    <StoreConfigConsumer>
      {({
        storeConfig,
        storeWidgets,
        defaultWidgets,
      }) => (
        <div>
          <main>
            <RootCategoryPage
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

export async function getStaticProps() {
  // console.log('Dynamic Page Props', Config.PageCacheSeconds);
  return { props: {}, revalidate: Config.PageCacheSeconds };
}

CategoryPage.propTypes = {
};

export default CategoryPage;
