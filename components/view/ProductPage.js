import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Head from 'next/head';

import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { LayoutContainer } from '@/store/layout/layout';
import { StoreConfigConsumer, StoreConfigContext } from '@/store/core/context';
import { ProductDetailQuery, ProductLiveUpdatesQuery } from '@/store/product/product.graphql';
import { filterProductWidgets } from '@/store/layout/widget';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { buildSeoStructuredData, parseProductDetail } from '@/roanuz/view/product/model';
import { ProductPage as ProductPageController } from '@/roanuz/controller/product/page';
import { useBrandList } from '@/roanuz/view/brand/model';
import { SEOHead } from '@/roanuz/document';
import {
  dependencyRegister,
// eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/product';
import { useWaitForClientSide } from '@/roanuz/hooks/core';
import Config from '@/config';

dependencyRegister();

const ProductPage = ({
  urlMeta, widgets, storeConfig, attributeMeta,
}) => {
  const urlParts = urlMeta.relative_url.split('/');
  const urlKey = urlParts[urlParts.length - 1].replace(storeConfig.product_url_suffix, '');
  // console.log('x', urlKey, urlMeta);

  let webSiteCode = null;
  if (Config.RestrictProductByWebsite && attributeMeta.rzVisibleProdcutOnWebsiteCode) {
    webSiteCode = attributeMeta.rzVisibleProdcutOnWebsiteCode;
  }
  const {
    loading: pageLoading,
    error: pageError,
    data: pageaData,
  } = useQuery(
    ProductDetailQuery, {
      variables: { urlKey, webSiteCode },
      // fetchPolicy: 'network-only',
    },
  );

  const {
    loading: brandsLoading,
    error: brandsError,
    brands,
  } = useBrandList();

  const storeConfigContext = useContext(StoreConfigContext);
  const clientReady = useWaitForClientSide();
  const {
    data: productLiveUpdatesData,
  } = useQuery(ProductLiveUpdatesQuery, {
    variables: { urlKey },
    fetchPolicy: 'no-cache',
    skip: !clientReady,
  });

  if ((!pageaData) && pageLoading) return (<PageLoadingView message="Preparing Product page" />);
  if ((!pageaData) && pageError) return (<PageErrorView error={pageError} />);

  if ((!brands) && brandsLoading) return (<PageLoadingView message="Hleð síðu" />);
  if ((!brands) && brandsError) return (<PageErrorView error={brandsError} />);
  // console.log('Product Page data ready');
  if (pageaData && !pageaData.products.items.length) {
    return (
      <PageErrorView
        error={{ message: 'Vara fannst ekki' }}
      />
    );
  }

  const product = pageaData.products.items[0];
  const productLiveUpdates = productLiveUpdatesData && productLiveUpdatesData.products.items[0];

  const parsedProduct = parseProductDetail(
    product, attributeMeta, productLiveUpdates, storeConfigContext,
  );

  const pageWidgets = filterProductWidgets({ widgets, product });
  const breadcrumbs = product.category ? product.category.breadcrumbs : [];
  let pageTitle = product.meta_title;

  if (!pageTitle) {
    pageTitle = parsedProduct.name;
    if (breadcrumbs && breadcrumbs.length) {
      const seperator = ` ${storeConfig.title_separator} `;
      const names = breadcrumbs.map((x) => x.category_name);
      pageTitle = `${pageTitle}${seperator}${names.join(seperator)}`;
    }
  }

  const matchedBrands = brands.filter((x) => x.id === `${parsedProduct.brandId}`);
  let productBrand = null;
  if (matchedBrands.length > 0) {
    [productBrand] = matchedBrands;
  }

  // console.log('Product', parsedProduct);

  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <SEOHead
            title={pageTitle}
            desc={product.meta_description || parsedProduct.name}
            keywords={product.meta_keyword}
          />
          <Head>
            <script
              type="application/ld+json"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={
                { __html: JSON.stringify(buildSeoStructuredData(parsedProduct)) }
              }
              key="jsonld"
            />
            <meta
              property="og:type"
              content="og:product"
              key="og_type"
            />
            <meta
              property="og:image"
              content={parsedProduct.gallery.image.url}
              key="og_image"
            />
            <meta
              property="product:price:amount"
              content={`${parsedProduct.price}`}
            />
            <meta
              property="product:price:currency"
              content={parsedProduct.currency}
            />
          </Head>
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.Content} />
          <ProductPageController
            product={parsedProduct}
            productBrand={productBrand}
          />
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
        </div>
      )}
    </StoreConfigConsumer>
  );
};

ProductPage.propTypes = {
  urlMeta: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  storeConfig: PropTypes.object.isRequired,
  attributeMeta: PropTypes.object,
};

export default ProductPage;
