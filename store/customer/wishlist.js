import {
  AddToWishListMutation,
  CustomerWishListQuery, RemoveFromWishListMutation,
} from '@/store/customer/query';
import { useMutation } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/store/core/context';
import { WishListContext } from '@/store/core/wishlistContext';
import { PendingWishListStorage } from '@/roanuz/lib/cart';
import { useRouter } from 'next/router';
import Config from '@/config';

export const useAddToWishList = ({
  item,
  onCompleted = null,
}) => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  // Response
  const [response, setResponse] = useState({
    called: false,
    loading: false,
    error: null,
    data: null,
  });

  // Add to Wishlist
  const [addToWishList, addToWishListMutation] = useMutation(AddToWishListMutation, {
    onCompleted: (wishListData) => {
      setResponse({
        ...response,
        loading: false,
        error: null,
        data: wishListData,
      });
      if (onCompleted) {
        onCompleted(wishListData);
      }
      // To hide the done text after 3s.
      setTimeout(() => {
        setResponse((state) => ({
          ...state,
          data: null,
        }));
      }, 3000);
    },
  });

  // Track Add to Wishlist
  useEffect(() => {
    setResponse((state) => ({
      ...state,
      loading: addToWishListMutation.loading,
      error: addToWishListMutation.error,
    }));
  }, [addToWishListMutation.loading, addToWishListMutation.error]);

  const callAddToWishList = (forWishListId) => {
    const updatedItem = {
      sku: item.sku,
      quantity: item.quantity,
    };
    const wishListItems = [updatedItem];

    const wishListVariables = { wishListItems };
    console.log('👌 Adding item to wishlist', wishListVariables);
    const refetchQueries = [];
    if (userContext.token) {
      refetchQueries.push(
        {
          query: CustomerWishListQuery,
          variables: { wishListId: forWishListId, pageSize: Config.WishListPageSize },
        },
      );
    }
    addToWishList({
      variables: { wishListId: forWishListId, ...wishListVariables },
      refetchQueries,
    });
  };
  const wishListContext = useContext(WishListContext);
  const { productMiniData } = wishListContext;
  const allProductSKU = Object.keys(productMiniData);

  const onAddToWishList = () => {
    setResponse((state) => ({
      ...state,
      loading: true,
    }));

    if (!userContext.token) {
      PendingWishListStorage.store({
        sku: item.sku,
        quantity: item.quantity,
      });
      router.push({
        pathname: '/customer/account/login/',
        query: { next: router.asPath },
      });
    } else if (allProductSKU.length === Config.WishListPageSize) {
      setResponse((state) => ({
        ...state,
        loading: false,
      }));
      // eslint-disable-next-line no-alert
      alert(`You can add only ${Config.WishListPageSize} items to a wish list`); // Temporary Alert till we add a page.
    } else {
      callAddToWishList(userContext.wishListId);
    }
  };

  return [onAddToWishList, response];
};

export const useRemoveFromWishList = ({
  onCompleted = null,
}) => {
  const userContext = useContext(UserContext);
  // Response
  const [response, setResponse] = useState({
    called: false,
    removeLoading: false,
    removeError: null,
    data: null,
  });

  // Remove from Wishlist
  const [removeFromWishList, removeFromWishListMutation] = useMutation(RemoveFromWishListMutation, {
    onCompleted: (wishListData) => {
      setResponse({
        ...response,
        removeLoading: false,
        removeError: null,
        data: wishListData,
      });
      if (onCompleted) {
        onCompleted(wishListData);
      }
    },
  });

  // Track Remove from Wishlist
  useEffect(() => {
    setResponse((state) => ({
      ...state,
      removeLoading: removeFromWishListMutation.loading,
      removeError: removeFromWishListMutation.error,
    }));
  }, [removeFromWishListMutation.loading, removeFromWishListMutation.error]);

  const callRemoveFromWishList = (item, forWishListId) => {
    const wishlistItemsIds = [item];

    const wishListVariables = { wishlistItemsIds };
    console.log('👌 Removing item from wishlist', wishListVariables);
    const refetchQueries = [];
    if (userContext.token) {
      refetchQueries.push(
        {
          query: CustomerWishListQuery,
          variables: { wishListId: forWishListId, pageSize: Config.WishListPageSize },
        },
      );
    }
    removeFromWishList({
      variables: { wishListId: forWishListId, ...wishListVariables },
      refetchQueries,
    });
  };

  const onRemoveFromWishList = (itemId) => {
    setResponse((state) => ({
      ...state,
      removeLoading: true,
    }));

    callRemoveFromWishList(itemId, userContext.wishListId);
  };

  return [onRemoveFromWishList, response];
};
