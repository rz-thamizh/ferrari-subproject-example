import React from 'react';
import { useRouter } from 'next/router';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

import {
  LayoutContainer,
} from '@/store/layout/layout';

import { StoreConfigConsumer } from '@/store/core/context';
import { SearchResultPage as SearchResultPageController } from '@/roanuz/page/searchResult';

export const SearchResultPage = () => {
  const router = useRouter();
  const { q } = router.query;
  return (
    <StoreConfigConsumer>
      {({
        storeWidgets,
        defaultWidgets,
      }) => (
        <div>
          <main>
            <SearchResultPageController
              searchText={q}
              widgets={storeWidgets}
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

export async function getServerSideProps({ query }) {
  return { props: { q: query.q } };
}

SearchResultPage.propTypes = {
};

export default SearchResultPage;
