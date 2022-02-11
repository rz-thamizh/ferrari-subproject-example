import React from 'react';
import PropTypes from 'prop-types';

import { StoreConfigConsumer } from '@/store/core/context';
import { SEOHead } from '@/roanuz/document';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/category';
// import { CategoryProductsWithFilterController } from '../controller/category/productsWithFilter';
import { CategoryProductsWithFilterControllerV2 } from '../controller/category/filterv2/productsWithFilter';

dependencyRegister();

export const SearchResultPage = ({
  searchText,
  widgets,
}) => {
  const title = `Leit: ${searchText}`;
  const desc = title;

  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <SEOHead
            title={title}
            desc={desc}
          />
          <div>
            <CategoryProductsWithFilterControllerV2
              searchText={searchText}
              widgets={widgets}
              forceFilterView
              titleText={searchText}
              isSearchResultPage
            />
          </div>
        </div>
      )}
    </StoreConfigConsumer>
  );
};

SearchResultPage.propTypes = {
  searchText: PropTypes.string,
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
};
