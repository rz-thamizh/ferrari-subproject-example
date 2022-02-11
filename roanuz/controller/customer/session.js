import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { onClient } from '@/roanuz/clientSide';
import { UserContext } from '@/store/core/context';
import { CustomerProfileMiniQuery } from '@/store/customer/query';
import { CartQuery, CustomerCartQuery } from '@/store/cart/query';
import { LoadingView, ErrorView } from '@/roanuz/view/status';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { CookieManager } from '@/lib/cookie';
import {
  useRemoveErrorItemsFromCart,
  useReAddBulkProductsToCart,
} from '@/store/cart/cart';
import { PendingWishListStorage } from '@/roanuz/lib/cart';
import { useAddToWishList } from '@/store/customer/wishlist';

export const BaseUserSessionLoader = ({ loadingMessage, silentError }) => {
  const userToken = CookieManager.get('roanuz_user_token');
  const cartId = CookieManager.get('roanuz_cart_id');
  const user = useContext(UserContext);

  const [fetchProfile, {
    loading,
    error,
    data,
    called: fetchProfileCalled,
  }] = useLazyQuery(
    CustomerProfileMiniQuery,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [fetchCart, {
    loading: cartLoading,
    error: cartError,
    data: cartData,
    called: fetchCartCalled,
  }] = useLazyQuery(
    userToken ? CustomerCartQuery : CartQuery,
    {
      fetchPolicy: 'network-only',
    },
  );

  let pendingWishListItem = null;
  if (typeof window !== 'undefined') {
    pendingWishListItem = PendingWishListStorage.fetch();
  }
  const [addToWishistFromPending, { wishListAddError, done: addToWishData }] = useAddToWishList({
    item: pendingWishListItem,
    onCompleted: (data1) => {
      console.log('👐 Item added to your Wish List', data1, addToWishData, wishListAddError);
      if (data1) {
        PendingWishListStorage.remove();
      }
    },
  });

  const [captureCartId, setCaptureCartId] = useState(null);
  const [captureProdutsToBeReAdded, setCaptureProdutsToBeReAdded] = useState([]);

  const onCartItemsReAddedSuccess = () => {
    user.setCartInternallyProcessing(false);
    user.setOutOfStockError(
      'Sumar vörur eruu ekki lengur í boði og hafa verið fjarlægðar úr körfunni þinni',
    );
  };

  const [reAddItemsToCart] = useReAddBulkProductsToCart({
    onCompleted: onCartItemsReAddedSuccess,
  });

  const onRemovedItemsSuccess = () => {
    console.log('Now Re-UP-Cart');
    reAddItemsToCart(captureCartId, captureProdutsToBeReAdded);
  };

  const [removeItemsFromCart] = useRemoveErrorItemsFromCart({
    onCompleted: onRemovedItemsSuccess,
  });

  const productsListBackup = (items) => {
    items.forEach((item) => {
      if (item && item.product.stock_status === 'IN_STOCK') {
        for (let i = 0; i < item.quantity; i += 1) {
          const itemRef = {
            sku: item.product.sku,
            quantity: 1,
          };
          setCaptureProdutsToBeReAdded((state) => [...state, itemRef]);
        }
      }
    });
  };

  const cartKey = userToken ? 'customerCart' : 'cart';

  useEffect(() => {
    if (!data) return;
    if (
      data.customer == null
      && error
      && error.graphQLErrors.length
      && error.graphQLErrors[0].extensions
      && error.graphQLErrors[0].extensions.category === 'graphql-authorization'
    ) {
      console.log('Found an invalid session, logging out user');
      // Invalid user session
      user.unsetUserToken();
      user.unsetCartId();
    } else if (data.customer) {
      const profile = data.customer;
      user.setLoadedProfile(profile);
    }
  }, [data]);

  useEffect(() => {
    if (!cartData) return;
    if (cartData && cartData[cartKey]) {
      const cart = cartData[cartKey];
      const newCartId = cart.id;
      if (cart === null) {
        // Cart ID no longer active
        user.unsetCartId();
        user.setCartVerified(true, 0);
      } else {
        // Update cart id with latest & active
        if (cartError && cartData[cartKey] && cartData[cartKey].items) {
          productsListBackup(cartData[cartKey].items, newCartId);
          setCaptureCartId(newCartId);
          const itemsToBeDeleted = cartData[cartKey].items.filter((op) => op !== null);
          user.setCartInternallyProcessing(true);
          removeItemsFromCart(itemsToBeDeleted, newCartId);
          // const outOfStockItems = cartData[cartKey].items
          //   .filter((op) => op && op.product && op.product.stock_status === 'OUT_OF_STOCK');
          // if (outOfStockItems.length) {
          //   removeItemsFromCart(outOfStockItems, newCartId);
          // }
        }
        if (newCartId !== user.cartId) {
          user.setCartId(newCartId);
        }
        user.setCartVerified(true, cart.total_quantity);
      }
    }
  }, [cartData]);

  useEffect(() => {
    if (user.requireCartRefresh) {
      user.setRequireCartRefresh(false, false, 0);
      fetchCart({ variables: { cartId: user.cartId } });
    }
  }, [user.requireCartRefresh]);

  if (!user.loaded) {
    if (user.token !== userToken) {
      // Update context
      if (userToken) {
        user.setUserToken(userToken);
        if (pendingWishListItem) {
          addToWishistFromPending();
        }
      } else if (user.token) {
        user.unsetUserToken();
      }
    }

    if (!user.token) {
      // User not logged in
      user.setLoaded(true);
    }

    if ((!fetchProfileCalled) && user.token) {
      console.log('☀️ Fetching user profile...');
      fetchProfile();
    }
  }

  if (!user.cartVerified) {
    if (!fetchCartCalled) {
      if (cartId || userToken) {
        console.log('🛒 Verifing Cart...');
        fetchCart({ variables: { cartId } });
      } else {
        user.setCartVerified(true, 0);
      }
    }
  }

  if (user.loaded && user.cartVerified) {
    return null;
  }

  const dataWaiting = (!data) && (!cartData);
  const isLoading = dataWaiting && (loading || cartLoading);
  const isError = error || cartError;

  if (isLoading && loadingMessage) {
    return (
      <LoadingView message={loadingMessage} />
    );
  }

  if ((!data) && isError && silentError === false) {
    return (
      <ErrorView error={error || cartError} />
    );
  }

  return null;
};

BaseUserSessionLoader.propTypes = {
  loadingMessage: PropTypes.string,
  silentError: PropTypes.bool,
};

export const UserSessionLoader = withDependencySupport(BaseUserSessionLoader, 'UserSessionLoader');

export const BaseClientUserSession = onClient(UserSessionLoader);
export const ClientUserSession = withDependencySupport(BaseClientUserSession, 'ClientUserSession');
