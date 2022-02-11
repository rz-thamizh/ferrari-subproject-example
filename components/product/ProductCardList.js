import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import { ProductCardListQuery } from '@/store/product/product.graphql';
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';

const ProductCardList = ({
  products,
  productsLoaded = false,
  showSketch = true,
  loadProducts = false,
}) => {
  const [loadedProducts, setLoadedProducts] = useState({
    products: [...products],
    loaded: productsLoaded,
  });

  useEffect(() => {
    setLoadedProducts((state) => ({
      ...state,
      loaded: productsLoaded,
      products: [...products],
    }));
  }, [products, productsLoaded]);

  const urlKeys = loadedProducts.products.map((p) => p.url_key);
  const [loadQuery, {
    called, loading, error, data: productData,
  }] = useLazyQuery(ProductCardListQuery, { variables: { urlKeys } });
  useEffect(() => {
    if (loadProducts && !called) {
      loadQuery();
    }

    if (called && productData && !loadedProducts.loaded) {
      setLoadedProducts({
        ...loadedProducts,
        loaded: true,
        products: [...productData.products.items],
      });
    }
  }, [loadProducts, called, productData, loadedProducts, loadQuery]);

  if (loading && !showSketch) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);

  return (
    <div className="debug-flex debug-product-card-list">
      {loadedProducts.products.map((product) => (
        <ProductCard
          key={product.url_key}
          product={product}
          productLoaded={loadedProducts.loaded}
          showSketch={showSketch}
          loadProduct={false}
        />
      ))}
    </div>
  );
};

ProductCardList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  productsLoaded: PropTypes.bool,
  showSketch: PropTypes.bool,
  loadProducts: PropTypes.bool,
};

export default ProductCardList;
