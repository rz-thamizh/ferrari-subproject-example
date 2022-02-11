import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { UserContext } from '@/store/core/context';
import { CustomerWishListQuery } from '@/store/customer/query';
import Config from '@/config';

export const WishListContext = React.createContext({
  productMiniData: {},
  wishListData: {},
  loading: null,
  error: null,
});
export const WishListConsumer = WishListContext.Consumer;

function prepareProductMiniData(wishListedItemsData) {
  const productMini = {};
  const { items } = wishListedItemsData.customer.wishlist_v2.items_v2;
  for (let i = 0; i < items.length; i += 1) {
    const productId = items[i].id;
    const productSku = items[i].product.sku;
    productMini[productSku] = productId;
  }
  return productMini;
}

export const WishListProvider = ({ children }) => {
  const [productMiniData, setProductMiniData] = useState({});
  const [wishListData, setWishListData] = useState({});
  const userContext = useContext(UserContext);

  const [fetchWishList, {
    error,
    loading,
    called,
    data: wishListedItemsData,
  }] = useLazyQuery(CustomerWishListQuery);

  useEffect(() => {
    if (wishListedItemsData && userContext.token) {
      setWishListData(wishListedItemsData);
      if (wishListedItemsData.customer && wishListedItemsData.customer.wishlist_v2.items_v2) {
        const wishListItems = prepareProductMiniData(wishListedItemsData);
        setProductMiniData(wishListItems);
      }
    }
  }, [wishListedItemsData]);

  useEffect(() => {
    if ((!called) && userContext.loaded && userContext.token) {
      console.log('❤️ Fetching Wishlist...');
      fetchWishList({
        variables: { wishListId: userContext.wishListId, pageSize: Config.WishListPageSize },
      });
    }
  }, [userContext.loaded, userContext.token]);

  let errorObject = error;
  if (wishListedItemsData && wishListedItemsData.customer && error) {
    // Wishlist not created for this user yet.
    // So ignore the error
    errorObject = null;
  }

  return (
    <WishListContext.Provider value={{
      productMiniData, wishListData, loading, error: errorObject,
    }}
    >
      {children}
    </WishListContext.Provider>
  );
};

WishListProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
