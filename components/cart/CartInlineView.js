import React, { useContext } from 'react';
import { UserContext } from '@/store/core/context';
import { useQuery } from '@apollo/client';
import { CartQuery } from '@/store/cart/query';
import ErrorView from '@/components/utils/ErrorView';
import LoadingView from '../utils/LoadingView';

const CartInlineView = () => {
  const userContext = useContext(UserContext);
  const { loading, error, data: cartResponse } = useQuery(CartQuery, {
    variables: { cartId: userContext.cartId },
    ssr: false,
    skip: !userContext.cartId,
    // fetchPolicy: 'cache-and-network',
  });

  if (error) return (<ErrorView error={error} />);

  // Inactive Cart
  // if ((!loading) && !cartResponse) {
  //   userContext.unsetCartId();
  // }

  const cart = cartResponse && cartResponse.cart;

  return (
    <div className="debug-cart-inline">
      <div className="iconView">
        <span>Cart</span>
        {
        cart
          ? (
            <span>
              &nbsp;
              {cart.total_quantity}
            </span>
          )
          : (<span>.</span>)
        }
      </div>
      <div className="popupViewx">
        {loading && (
          <div>
            <LoadingView message="loading cart..." />
          </div>
        )}
        {cart && (!loading) && (
          <div>
            <div>
              Total: &nbsp;
              {cart.prices.grand_total.currency}
              {cart.prices.grand_total.value}
            </div>
            <ul>
              {cart.items.map((item) => (
                <li key={item.uid}>
                  <div>
                    {
                      (!item.product.thumbnail.disabled)
                      && <img src={item.product.thumbnail.url} alt={item.product.name} />
                    }
                    {item.product.name}
                    &nbsp;x&nbsp;
                    {item.quantity}
                    &nbsp;=&nbsp;
                    {item.prices.row_total_including_tax.currency}
                    {item.prices.row_total_including_tax.value}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

CartInlineView.propTypes = {

};

export default CartInlineView;
