import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import AddToCartButton from '@/components/cart/AddToCartButton';
import OptionsView from '@/roanuz/options/OptionsView';
import { ProductCardQuery } from '@/store/product/product.graphql';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ProductCard = ({
  product,
  productLoaded = false,
  showSketch = true,
  loadProduct = false,
}) => {
  const [loadedProduct, setLoadedProduct] = useState({
    loaded: false, product: { ...product },
  });

  useEffect(() => {
    setLoadedProduct((state) => ({
      ...state,
      loaded: productLoaded,
      product: { ...product },
    }));
  }, [product, productLoaded]);

  const [loadQuery, {
    called, loading, error, data: productData,
  }] = useLazyQuery(ProductCardQuery);

  useEffect(() => {
    if ((!productLoaded) && loadProduct && !called) {
      const urlKey = loadedProduct.product.url_key;
      loadQuery({ variables: { urlKey } });
    }

    if (productData && !loadedProduct.loaded) {
      setLoadedProduct({
        ...loadedProduct,
        loaded: true,
        product: { ...productData.products.items[0] },
      });
    }
  }, [productLoaded, loadProduct, called, productData, loadedProduct, loadQuery]);

  const prod = loadedProduct.product;
  const [userConfig, setUserConfig] = useState({ selection: {} });
  const [cartItem, setCartItem] = useState({
    selected_options: null,
    entered_options: null,
  });
  useEffect(() => {
    const newSelection = [];
    Object.keys(userConfig.selection).forEach((key) => {
      if (userConfig.selection[key] !== null) {
        newSelection.push(userConfig.selection[key]);
      }
    });

    setCartItem((state) => ({
      ...state,
      selected_options: newSelection.length === 0 ? null : newSelection,
    }));
  }, [userConfig.selection]);

  useEffect(() => {
    setCartItem((state) => ({
      ...state,
      ...{ quantity: 1, sku: prod.sku },
    }));
  }, [prod]);

  if (loading && !showSketch) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);

  const link = `/${prod.url_key}${prod.url_suffix}`;
  const configs = [...(prod.configurable_options || [])];
  configs.sort((x, y) => x.position - y.position);

  const onConfigSelection = (optionId, valueId) => {
    const update = {};
    update[optionId] = valueId;
    console.log('updating', userConfig, update);
    setUserConfig((state) => ({
      ...state,
      selection: {
        ...state.selection,
        ...update,
      },
    }));
  };

  const onOptionChange = (changes) => {
    const options = Object.keys(changes).map(
      (key) => {
        const value = { uid: key, value: changes[key] };
        if (value.value instanceof Array) {
          value.value = value.value.join(',');
        }
        return value;
      },
    ).filter(
      (x) => x.value !== '',
    );

    setCartItem((state) => ({
      ...state,
      entered_options: options.length ? options : null,
    }));
  };

  let configView = null;
  if (configs.length > 0) {
    configView = (
      <div>
        {configs.map((pconfig) => (
          <div key={pconfig.uid}>
            {pconfig.label}
            <ul>
              {pconfig.values.map((item) => (
                <li
                  key={item.uid}
                  className={userConfig.selection[pconfig.uid] === item.uid ? 'active' : ''}
                  onClick={() => onConfigSelection(pconfig.uid, item.uid)}
                  onKeyDown={() => onConfigSelection(pconfig.uid, item.uid)}
                  role="presentation"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="debug-product-card">
      <>
        <Link href={link}>
          <a>
            <h3>{prod.name}</h3>
          </a>
        </Link>
        {(prod.image && !prod.image.disabled) && (
        <img
          src={prod.image.url}
          alt={prod.image.label}
        />
        )}
        {configView}
        {loadedProduct.loaded ? (
          <div>
            <div>
              Frá&nbsp;
              {prod.price_range.minimum_price.final_price.currency}
              {prod.price_range.minimum_price.final_price.value}
            </div>
            <div>
              <OptionsView
                options={prod.options}
                onChange={onOptionChange}
                currency={prod.price_range.minimum_price.final_price.currency}
              />
              {cartItem.sku && (
                <AddToCartButton
                  item={cartItem}
                />
              )}
            </div>
          </div>
        ) : (
          <div>||||||||||||||</div>
        )}
      </>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  productLoaded: PropTypes.bool,
  showSketch: PropTypes.bool,
  loadProduct: PropTypes.bool,
};

export default ProductCard;
