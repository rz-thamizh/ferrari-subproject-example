import { useState, useContext, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { UserContext } from '@/store/core/context';
import { useRouter } from 'next/router';
import { MergeCartMutation, CustomerCartQuery } from '@/store/cart/query';

export const useCustomerNewSessoin = ({
  nextRoutePath, nextRouteParams, nextUrl,
}) => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const nextPath = nextUrl || router.query.next || '/';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingCartId, setPendingCartId] = useState(null);

  const redriect = () => {
    setLoading(false);
    if (nextRoutePath) {
      router.push(nextRoutePath, nextRouteParams);
    } else {
      window.location.href = nextPath;
    }
  };

  const [
    mergeCart,
    { called: mergeCalled, error: mergeCartError, data: mergeCartData },
  ] = useMutation(MergeCartMutation, {
    onCompleted: (data) => {
      console.log('👐 Cart Merged', data, mergeCartData, mergeCartError);
      if (data) {
        redriect();
      }
    },
  });

  useEffect(() => {
    setError(mergeCartError);
  }, [mergeCartError]);

  const [
    getCustomerCart,
    { data: customerCartData, error: customerCartError },
  ] = useLazyQuery(CustomerCartQuery);
  useEffect(
    () => {
      if (!customerCartData) return;
      console.log('Got customer cart data', customerCartData);
      if (
        (!mergeCalled)
        && customerCartData.customerCart.id
        && pendingCartId
        && (pendingCartId !== customerCartData.customerCart.id)
      ) {
        const cartId = customerCartData.customerCart.id;
        const variables = {
          srcCartId: pendingCartId,
          cartId,
        };
        setPendingCartId(null);
        userContext.setCartId(cartId, true);
        mergeCart({ variables });
      }
    },
    [mergeCart, mergeCalled, customerCartData, userContext],
  );

  useEffect(() => {
    setError(customerCartError);
  }, [customerCartError]);

  const handle = (token) => {
    let done = true;
    const currentToken = userContext.token ? `${userContext.token}` : null;
    setPendingCartId(userContext.cartId);
    userContext.setUserToken(token);
    if (userContext.cartId && (!currentToken)) {
      // Guest user with a Cart, Merge cart
      done = false;
      getCustomerCart();
    } else if (userContext.cartId && currentToken) {
      // Logged in user with a cart - Discard cart
      userContext.unsetCartId();
    }

    if (done) {
      redriect();
    }
  };

  return [handle, { loading, error }];
};
