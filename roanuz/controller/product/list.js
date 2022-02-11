import PropTypes from 'prop-types';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ProductCardListQuery } from '@/store/product/product.graphql';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext, StoreConfigContext } from '@/store/core/context';
import { LoadingView, ErrorView } from '@/roanuz/view/status';
import { ProductGridLayout } from '@/roanuz/layout/product/grid';
import { ProductCardLayout, ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { SweetSlider } from '@/roanuz/view/sweetSlider/sweetSlider';
import { useWaitForClientSide } from '@/roanuz/hooks/core';
import { ProductCard, ProductCardWithLoaderLegacy } from './card';
import Config from '../../../config';

function fetchWebSiteCode(config) {
  if (Config.RestrictProductByWebsite && config.attributeMeta.rzVisibleProdcutOnWebsiteCode) {
    return config.attributeMeta.rzVisibleProdcutOnWebsiteCode;
  }
  return null;
}

export const ProductCardList = ({
  products,
  productsLoaded = false,
  showSketch = true,
  loadProducts = false,
}) => {
  const [loadedProducts, setLoadedProducts] = useState({
    products: [...products],
    loaded: productsLoaded,
  });

  const storeConfigInstance = useContext(StoreConfigContext);
  const webSiteCode = fetchWebSiteCode(storeConfigInstance);

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
  }] = useLazyQuery(ProductCardListQuery, { variables: { urlKeys, webSiteCode } });
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
    <ProductGridLayout>
      {loadedProducts.products.map((product) => (
        <ProductCardWithLoaderLegacy
          key={product.url_key}
          product={product}
          productLoaded={loadedProducts.loaded}
          showSketch={showSketch}
          loadProduct={false}
        />
      ))}
    </ProductGridLayout>
  );
};

ProductCardList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  productsLoaded: PropTypes.bool,
  showSketch: PropTypes.bool,
  loadProducts: PropTypes.bool,
};

export const ProductGrid = ({
  products,
  autoFit,
  withBorder,
  withFlexScroll,
  displayMode,
  showShortDesc,
  className,
  cardClassName,
}) => {
  return (
    <ProductGridLayout
      autoFit={autoFit}
      withBorder={withBorder}
      withFlexScroll={withFlexScroll}
      displayMode={displayMode}
      showShortDesc={showShortDesc}
      className={className}
    >
      {products.map((product) => (
        <ProductCard
          key={product.url_key}
          product={product}
          displayMode={displayMode}
          showShortDesc={showShortDesc}
          className={cardClassName}
        />
      ))}
    </ProductGridLayout>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  autoFit: PropTypes.bool,
  withBorder: PropTypes.bool,
  withFlexScroll: PropTypes.bool,
  displayMode: ProductCardLayout.propTypes.displayMode,
  showShortDesc: PropTypes.bool,
  className: PropTypes.string,
  cardClassName: PropTypes.string,
};

function preserveURLOrder(urlKeys, loadedProducts) {
  const sorted = [];
  urlKeys.forEach((url) => {
    const item = loadedProducts.find((x) => x.url_key === url);
    if (item) {
      sorted.push(item);
    }
  });
  return sorted;
}

export const ProductCardListWithLoader = ({
  products,
  autoFit,
  withBorder,
  withFlexScroll,
  displayMode,
}) => {
  const urlKeys = products.map((p) => p.url_key);
  const clientReady = useWaitForClientSide();
  const userContext = useContext(UserContext);
  const storeConfigInstance = useContext(StoreConfigContext);
  const webSiteCode = fetchWebSiteCode(storeConfigInstance);

  const {
    loading, error, data: productData, refetch,
  } = useQuery(ProductCardListQuery, { variables: { urlKeys, webSiteCode } });

  useEffect(() => {
    if (clientReady && userContext.token && Config.EnableClientSideRefresh) {
      refetch();
    }
  }, [clientReady, refetch]);

  if ((!productData) && loading) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);

  const loadedProducts = preserveURLOrder(urlKeys, productData.products.items);
  // console.log('Loaded', loadedProducts);
  return (
    <ProductGrid
      products={loadedProducts}
      autoFit={autoFit}
      withBorder={withBorder}
      withFlexScroll={withFlexScroll}
      displayMode={displayMode}
    />
  );
};

ProductCardListWithLoader.propTypes = {
  ...ProductGrid.propTypes,
  displayMode: ProductCardLayout.propTypes.displayMode,
};

export const ProductSlider = ({
  products,
  displayMode,
  showShortDesc,
}) => {
  let responsive = {
    xs: { columns: 2, showPageArrows: false, space: '15px' },
    sm: { columns: 3, showPageArrows: false, space: '25px' },
    md: { columns: 4, showPageArrows: false, space: '25px' },
    lg: { columns: 5, showPageArrows: true, space: '25px' },
  };

  if (displayMode === ProductCardDisplayMode.OneByThree) {
    responsive = {
      xs: { columns: 1, showPageArrows: false },
      sm: { columns: 2, showPageArrows: false },
      md: { columns: 3, showPageArrows: false },
      lg: { columns: 3, showPageArrows: true },
    };
  }

  const items = products.map((product) => (
    <ProductCard
      key={product.url_key}
      product={product}
      displayMode={displayMode}
      showShortDesc={showShortDesc}
    />
  ));

  return (
    <SweetSlider
      items={items}
      responsive={responsive}
      space="25px"
    />
  );
};

ProductSlider.propTypes = {
  ...ProductGrid.propTypes,
  displayMode: ProductCardLayout.propTypes.displayMode,
};

export const ProductSliderWithLoader = ({
  products,
  ...options
}) => {
  const urlKeys = products.map((p) => p.url_key);
  const clientReady = useWaitForClientSide();
  const userContext = useContext(UserContext);
  const storeConfigInstance = useContext(StoreConfigContext);
  const webSiteCode = fetchWebSiteCode(storeConfigInstance);

  const {
    loading, error, data: productData, refetch,
  } = useQuery(ProductCardListQuery, {
    variables: { urlKeys, webSiteCode },
    skip: !urlKeys.length,
  });

  useEffect(() => {
    if (clientReady && userContext.token && Config.EnableClientSideRefresh) {
      refetch();
    }
  }, [clientReady, refetch]);

  if ((!productData) && loading) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);

  if (!productData) {
    return null;
  }
  const loadedProducts = preserveURLOrder(urlKeys, productData.products.items);

  return (
    <ProductSlider
      {...options}
      products={loadedProducts}
    />
  );
};

ProductSliderWithLoader.propTypes = {
  ...ProductSlider.propTypes,
};
