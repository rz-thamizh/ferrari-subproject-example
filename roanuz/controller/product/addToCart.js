import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useAddToCart, useRemoveFromCart, useUpdateProductQuantity, useCreateNewCart,
} from '@/store/cart/cart';
import { AddToCartView } from '@/roanuz/view/product/addToCart';
import { AddToCartConfigView } from '@/roanuz/view/product/addToCartConfig';
import { AddToCartSuccessView } from '@/roanuz/view/product/addToCartSuccess';
import { StatefulButton } from '@/roanuz/view/statefulView';
import { ReactComponent as DeleteIcon } from '@/roanuz/view/imgs/DeleteIcon.svg';
import { keyframes } from 'styled-components';
import { formatCurrency } from '@/roanuz/lib/cart';
import { Formik, Form } from 'formik';
import { FormItem } from '@/roanuz/view/input';
import Validate from '@/roanuz/lib/validate';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import { Button } from '@/roanuz/view/button';
import { StockStatus } from '@/roanuz/view/product/models/stock';

export const AddToCart = ({
  product, options,
  onCartReset,
  onProductAdded,
  buttonText,
  ...buttonParams
}) => {
  const initState = () => ({
    sku: product.sku,
    quantity: 1,
    selectedOptions: {},
    enteredOptions: {},
    withProduct: null,
    groupedProducts: [],
  });

  const [configVisible, setConfigVisible] = useState(false);
  const [cartOption, setCartOption] = useState({ ...initState() });
  const [cartSuccess, setCartSuccess] = useState(false);
  const [showCrosssellProducts, setShowCrosssellProducts] = useState(false);
  const [productsAddedToCart, setProductsAddedToCart] = useState([]);

  const resetOption = () => {
    // console.log('Reseting Cart Options', initState());
    setCartOption({ ...initState() });
    if (onCartReset) {
      onCartReset();
    }
  };

  const onCartAdded = () => {
    setConfigVisible(false);
    resetOption();
    if (onProductAdded) {
      onProductAdded();
    }
    setCartSuccess(true);
    setShowCrosssellProducts(!cartOption.withProduct);
    setProductsAddedToCart([...productsAddedToCart, product]);
    if (cartOption.withProduct) {
      let withProductDetail = null;
      withProductDetail = product.crosssellProducts
        .filter((cp) => cp.sku === cartOption.withProduct);
      [withProductDetail] = withProductDetail;

      withProductDetail = {
        ...withProductDetail,
        isInsuranceProduct: true,
        priceText: formatCurrency(
          withProductDetail.price_range.minimum_price.final_price.value,
          withProductDetail.price_range.minimum_price.final_price.currency,
        ),
      };
      setProductsAddedToCart([...productsAddedToCart, product, withProductDetail]);
    }
  };
  const [addToCart, { loading, error, data: addToCartData }] = useAddToCart({
    item: cartOption,
    onCompleted: onCartAdded,
  });

  const handleOptionChanges = () => {
    const changes = {};
    if (options.withProduct !== undefined) {
      changes.withProduct = options.withProduct;
    }

    setCartOption({
      ...cartOption,
      ...changes,
    });
  };

  useEffect(() => {
    resetOption();
  }, [product.sku]);

  useEffect(() => {
    handleOptionChanges();
  }, [options]);

  const setRequiredDefaultUid = (selectedOptions, config, item) => {
    if (config.required && item.is_default) {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      if (config.type === 'checkbox' || config.type === 'multi') {
        selectedOptions[config.uid] = selectedOptions[config.uid]
          ? [...selectedOptions[config.uid], item.uid] : [item.uid];
      } else {
        selectedOptions[config.uid] = item.uid;
      }
      setCartOption({
        ...cartOption,
        selectedOptions,
      });
    }
  };

  const bundleProductSelectionOptions = () => {
    const selectedOptions = {
      ...cartOption.selectedOptions,
    };
    product.bundledItemOptions.forEach((config) => {
      if (config.options) {
        if (config.options.length === 1) {
          const singleItem = config.options[config.options.length - 1];
          setRequiredDefaultUid(selectedOptions, config, singleItem);
        } else {
          config.options.forEach((optionItem) => {
            setRequiredDefaultUid(selectedOptions, config, optionItem);
          });
        }
      }
    });
  };

  const groupedProductSelectionOptions = () => {
    // Once we introduce quantity field throughtout app,
    // we can make quantity dynamic
    const groupedProducts = product.groupedProducts.map((v) => (
      { sku: v.product.sku, quantity: 1 /* v.qty */ }));
    cartOption.groupedProducts = groupedProducts;
  };

  const isOptionRequired = () => {
    console.log('P', product);
    if (product.bundledItemOptions && product.bundledItemOptions.length) {
      bundleProductSelectionOptions();
    }
    if (product.groupedProducts && product.groupedProducts.length) {
      groupedProductSelectionOptions();
    }
    return (
      (product.configOptions && product.configOptions.length > 0)
      || (product.options && product.options.length > 0)
      || (product.bundledItemOptions && product.bundledItemOptions.length > 0)
      || (product.groupedProducts && product.groupedProducts.length > 0)
    );
  };

  const onOptionUpdate = (option, value) => {
    // console.log('Option Update', option, value);
    if (option === 'selected') {
      const selectedOptions = {
        ...cartOption.selectedOptions,
      };
      selectedOptions[value.uid] = value.value;
      setCartOption({
        ...cartOption,
        selectedOptions,
      });
    } else if (option === 'entered') {
      const enteredOptions = {
        ...cartOption.enteredOptions,
      };
      enteredOptions[value.uid] = value.value;
      setCartOption({
        ...cartOption,
        enteredOptions,
      });
    }
  };

  const onATC = () => {
    if ((!configVisible) && isOptionRequired()) {
      setConfigVisible(true);
    } else {
      addToCart();
    }
  };

  const ATC = ({ className: cn }) => (
    <AddToCartView
      className={cn}
      loading={loading}
      error={error}
      data={addToCartData}
      onClick={onATC}
      buttonText={buttonText}
      disabled={
        !product.available
        || (product.stockStatus && (product.stockStatus.status === StockStatus.AVAILABLE_SOON))
      }
      {...buttonParams}
    />
  );

  const closeCartSuccess = () => {
    setCartSuccess(false);
    setProductsAddedToCart([]);
  };

  const crosssellProductAdded = (csp) => {
    const productRef = { ...csp };
    if (!productRef.priceText) {
      productRef.isInsuranceProduct = true;
      productRef.priceText = formatCurrency(
        csp.price_range.minimum_price.final_price.value,
        csp.price_range.minimum_price.final_price.currency,
      );
    }
    setProductsAddedToCart([...productsAddedToCart, productRef]);
    setShowCrosssellProducts(false);
  };

  return (
    <>
      <ATC className="rz-button-atc" />
      <AddToCartConfigView
        addToCart={(<ATC />)}
        product={product}
        cartOption={cartOption}
        onOptionCancel={() => setConfigVisible(false)}
        onOptionUpdate={onOptionUpdate}
        show={configVisible}
      />
      <AddToCartSuccessView
        show={cartSuccess}
        showCrosssellProducts={showCrosssellProducts}
        onOptionCancel={() => closeCartSuccess()}
        products={productsAddedToCart}
        crossSellProducts={product.crosssellProducts}
        onCrosssellProductAdded={(csp) => crosssellProductAdded(csp)}
      />
    </>
  );
};

AddToCart.propTypes = {
  product: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  onCartReset: PropTypes.func,
  onProductAdded: PropTypes.func,
  buttonText: PropTypes.string,
  // item: PropTypes.shape({
  //   sku: PropTypes.string,
  //   quantity: PropTypes.number,
  //   disabled: PropTypes.bool,
  //   selected_options: PropTypes.arrayOf(PropTypes.string),
  //   entered_options: PropTypes.arrayOf(PropTypes.shape({
  //     uid: PropTypes.string.isRequired,
  //     value: PropTypes.string.isRequired,
  //   })),
  // }).isRequired,
};

const RunningLoader = keyframes`
  0% {
    transform: translateX(15px);
  }
  30% {
    transform: translateX(60px) rotate(45deg);
  }
  50% {
    transform: translateX(60px) rotate(-45deg);
  }
  80% {
    transform: translateX(60px);
  }
  100% {
    transform: translateX(15px);
  }
`;

export const RemoveFromCartMini = ({
  product,
  ...buttonParams
}) => {
  const [removeFromCart,
    { removeLoading, removeError, data: removeFromCartData }] = useRemoveFromCart({});

  const onRFC = () => {
    removeFromCart(product.uid);
  };

  return (
    <StatefulButton
      noborder
      state={{ loading: removeLoading, error: removeError, data: removeFromCartData }}
      buttonIcon={<DeleteIcon />}
      loadingIcon={<DeleteIcon />}
      buttonText="Fjarlægja"
      doneText="Fjarlægt"
      errorText="Villa, vinsamlegast reynið aftur"
      loadingKeyFrame={RunningLoader}
      onClick={onRFC}
      {...buttonParams}
    />
  );
};

RemoveFromCartMini.propTypes = {
  product: PropTypes.object.isRequired,
};

export const QuantitySelector = ({
  product,
}) => {
  const [formInitVal] = useState({
    quantity: product.quantity,
  });

  const [updateProductQuantity,
    { loading, error, data: updateQuantityData }] = useUpdateProductQuantity({});

  const onQuantityUpdate = (qty) => {
    if (qty && !Number.isNaN(parseInt(qty, 10)) && product.quantity !== parseInt(qty, 10)) {
      updateProductQuantity(product.uid, qty);
    }
  };

  const fields = {
    quantity: {
      type: 'text',
      name: 'Magn',
      id: 'quantity',
      validateFn: Validate.all([
        Validate.required,
        Validate.number,
      ], { message: 'Vinsamlegast sláið inn númer' }),
    },
  };

  const onSubmit = (values) => {
    onQuantityUpdate(values.quantity);
  };

  return (
    <div className="quantity-selector">
      <Formik initialValues={formInitVal} onSubmit={onSubmit}>
        {() => (
          <Form>
            <FormItem
              key="quantity"
              field={{
                ...fields.quantity,
                onBlur: (event) => {
                  onQuantityUpdate(event.target.value);
                },
              }}
            />
          </Form>
        )}
      </Formik>
      {loading && <LoadingView message="Uppfæri..." />}
      {error && <ErrorView error={error} />}
      {!loading && !error && updateQuantityData && <p className="update-success">Uppfært</p>}
    </div>
  );
};

QuantitySelector.propTypes = {
  product: PropTypes.object.isRequired,
};

export const CreateNewCart = () => {
  const [clearCart] = useCreateNewCart();

  return (
    <Button
      className="clear-cart-btn"
      mode="primary"
      filled
      alt="Clear Cart"
      onClick={() => clearCart()}
      ariaLabel="Clear Cart"
    >
      Eyða körfu
    </Button>
  );
};
