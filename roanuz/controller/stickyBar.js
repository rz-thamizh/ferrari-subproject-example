import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Config from '@/config';
import { useRouter } from 'next/router';
import { SearchBarView } from '@/roanuz/view/searchBar';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { WishListContext } from '@/store/core/wishlistContext';
import { StickBarView } from '../view/stickyBar';
import { ClientCartIndicatorController } from './cart';
import { ClientCartMiniController } from './cartMini';
import { ClientWishListMiniController } from './wishlistMini';

export const BaseStickyBarController = ({ categoryTreeData }) => {
  const router = useRouter();
  const wishListContext = useContext(WishListContext);
  const wishListData = (wishListContext.wishListData
    && wishListContext.wishListData.customer && wishListContext.wishListData.customer.wishlist_v2)
    ? wishListContext.wishListData.customer.wishlist_v2 : null;

  const wishList = {
    loading: wishListContext.loading,
    error: wishListContext.error,
    item: wishListData
      ? { total_quantity: wishListData.items_count ? wishListData.items_count : 0 } : null,
  };

  let indexPrefix = `${Config.AlgoliaIndexNamePrefix}`;
  if (Config.StoreViewCode) {
    indexPrefix = `${indexPrefix}${Config.StoreViewCode}_`;
  }

  const { q: searchQuery } = router.query;
  const onSearchSubmit = (text) => {
    const etext = encodeURIComponent(text);
    router.push(`/catalogsearch/result?q=${etext}`);
  };

  return (
    <StickBarView
      cart={(<ClientCartIndicatorController />)}
      CartMiniType={ClientCartMiniController}
      wishList={wishList}
      WishListMiniType={ClientWishListMiniController}
      categoryTreeLoading={categoryTreeData.categoryTreeLoading}
      categoryTree={categoryTreeData.categoryTree}
      searchView={
        (
          <SearchBarView
            productIndexName={`${indexPrefix}products`}
            categoryIndexName={`${indexPrefix}categories`}
            searchText={searchQuery}
            onSubmit={onSearchSubmit}
          />
        )
      }
    />
  );
};

BaseStickyBarController.propTypes = {
  categoryTreeData: PropTypes.object.isRequired,
};

export const StickyBarController = withDependencySupport(BaseStickyBarController, 'StickyBarController');
