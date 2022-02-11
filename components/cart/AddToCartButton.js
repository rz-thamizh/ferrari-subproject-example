import PropTypes from 'prop-types';
import React from 'react';
import { useAddToCart } from '@/store/cart/cart';
import StatefulView from '@/components/core/StatefulView';

const AddToCartButton = ({
  item,
}) => {
  const [addToCart, { loading, error, done: addToCartData }] = useAddToCart({ item });

  return (
    <div>
      <StatefulView
        state={{ loading, error, done: addToCartData }}
        loading={() => (
          <div>Adding...</div>
        )}
        error={(err) => (
          <div>{err.message}</div>
        )}
        done={() => (
          <div>Added</div>
        )}
      >
        <button
          type="button"
          onClick={() => addToCart()}
        >
          Add to cart
        </button>
      </StatefulView>
    </div>
  );
};

AddToCartButton.propTypes = {
  item: PropTypes.shape({
    sku: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    selected_options: PropTypes.arrayOf(PropTypes.string),
    entered_options: PropTypes.arrayOf(PropTypes.shape({
      uid: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

export default AddToCartButton;
