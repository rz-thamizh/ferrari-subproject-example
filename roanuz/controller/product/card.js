import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import { ProductCardQuery } from '@/store/product/product.graphql';
import { ProductCardView } from '@/roanuz/view/product/product';
import { ProductCardLayout } from '@/roanuz/layout/product/product';
import { parseProduct } from '@/roanuz/view/product/model';
import { StoreConfigContext } from '@/store/core/context';
import { AddToCart } from './addToCart';
import { AddToWishList } from './addToWishList';

export const ProductCard = ({
  product,
  displayMode,
  showShortDesc,
  className,
}) => {
  const storeConfig = useContext(StoreConfigContext);
  const parsedProduct = parseProduct(product, null, storeConfig);

  const acButton = (
    <AddToCart options={{}} product={parsedProduct} />
  );
  const awButton = (
    <AddToWishList product={parsedProduct} />
  );

  return (
    <ProductCardView
      product={parsedProduct}
      addToCart={acButton}
      addToWishList={awButton}
      displayMode={displayMode}
      showShortDesc={showShortDesc}
      className={className}
    />
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  displayMode: ProductCardLayout.propTypes.displayMode,
  showShortDesc: PropTypes.bool,
  className: PropTypes.string,
};

export const ProductCardWithLoaderLegacy = ({
  product,
  productLoaded = false,
  showSketch = true,
  loadProduct = false,
}) => {
  const storeConfig = useContext(StoreConfigContext);
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

  if (loading && !showSketch) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);
  if (!loadedProduct.loaded) return (<LoadingView />);

  const acButton = (
    <AddToCart options={{}} product={prod} />
  );

  const parsedProduct = parseProduct(prod, null, storeConfig);

  return (
    <ProductCardView
      product={parsedProduct}
      addToCart={acButton}
    />
  );
};

ProductCardWithLoaderLegacy.propTypes = {
  product: PropTypes.object.isRequired,
  productLoaded: PropTypes.bool,
  showSketch: PropTypes.bool,
  loadProduct: PropTypes.bool,
};
