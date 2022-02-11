/* eslint-disable react/jsx-props-no-spreading */
/* eslint no-use-before-define: ["error", { "variables": false }] */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { ProductSliderWithLoader, ProductCardListWithLoader } from '@/roanuz/controller/product/list';
import { ImageListView } from '@/roanuz/view/catalog/imageListView';
import { MagentoWidgetView } from '@/roanuz/view/magentoWidget';
import { ImageView } from '@/roanuz/view/image';
import { StoreConfigContext } from '@/store/core/context';
import { ProductCardDisplayMode } from '@/roanuz/layout/product/product';

function transformBuilder(storeConfig) {
  const baseLinkUrl = storeConfig.base_link_url;
  const secureBaseLinkUrl = storeConfig.secure_base_link_url;
  const productUrlSuffix = storeConfig.product_url_suffix;
  const baseMediaUrl = storeConfig.base_media_url;
  const baseStaticUrl = storeConfig.base_static_url;

  const ProductListView = (isGrid, urls, index, displayMode) => {
    const products = urls.map((p) => ({ url_key: p }));
    if (isGrid) {
      return (
        <ProductCardListWithLoader
          key={`products-list-${index}`}
          products={products}
          displayMode={displayMode}
        />
      );
    }

    return (
      <ProductSliderWithLoader
        key={`products-list-${index}`}
        products={products}
        grid={isGrid}
        displayMode={displayMode}
      />
    );
  };

  const ProductCarouselView = (urls, index) => {
    // eslint-disable-next-line react/destructuring-assignment
    const products = urls.map((p) => ({ url_key: p }));
    return (
      <ProductSliderWithLoader
        key={`products-list-${index}`}
        products={products}
        displayMode={ProductCardDisplayMode.OneBySix}
      />
    );
  };

  const ImageWidget = (className, columnCount, tabletColumnCount, mobileColumnCount, slides) => {
    return (
      <ImageListView
        className={className}
        desktopCount={parseInt(columnCount || '0', 10)}
        tabletSlides={parseInt(tabletColumnCount || '0', 10)}
        mobileCount={parseInt(mobileColumnCount || '0', 10)}
        slides={slides}
      />
    );
  };

  const transform = (node, index) => {
    if (node.attribs && node.attribs['data-rz-widget-id']) {
      const widgetId = node.attribs['data-rz-widget-id'];
      const widgetData = inferWidgetData(node);
      return (
        <MagentoWidgetView
          name={widgetId}
          data={widgetData}
          key={index}
        />
      );
    }

    const classes = node.attribs && node.attribs.class;
    if (classes && (classes.indexOf('block widget block-products-list') > -1)) {
      return inferProducts(node);
    }

    if (classes && (classes.indexOf('block widget block-new-products') > -1)) {
      return inferProducts(node);
    }

    let block = null;
    if (node.attribs && node.attribs['data-rz-block']) {
      block = node.attribs['data-rz-block'];
    }
    if (block === 'productList') {
      const keys = node.attribs['data-rz-products'].split(',');
      return ProductListView(false, keys);
    }
    if (block === 'image-slider') {
      return inferImageData(node);
    }

    if (node.type === 'tag' && node.name === 'a') {
      return transformLink(node, index);
    }

    if (node.type === 'tag' && node.name === 'img') {
      return transformImage(node, index);
    }

    if (node.type === 'script') {
      return null;
    }

    return undefined;
  };

  const inferWidgetData = (node) => {
    let jsonData = null;
    if (node.children) {
      node.children.forEach((childNode) => {
        if (childNode.name === 'code' && childNode.children
          && childNode.children[0]) {
          jsonData = JSON.parse(childNode.children[0].data);
        }
      });
    }
    return jsonData;
  };

  const inferImageData = (node) => {
    let jsonData = null;
    if (node.children) {
      node.children.forEach((childNode) => {
        if (childNode.name === 'code' && childNode.children
          && childNode.children[0]) {
          jsonData = JSON.parse(childNode.children[0].data);
        }
      });
    }
    if (jsonData && jsonData.slides && jsonData.slides.length) {
      return ImageWidget(
        jsonData.class_name,
        jsonData.column_count,
        jsonData.tablet_column_count,
        jsonData.mobile_column_count,
        jsonData.slides,
      );
    }
    return null;
  };

  const inferProducts = (node, index) => {
    let products = [];
    node.children.forEach((childNode) => {
      const newProducts = inferProduct(childNode, index);
      if (newProducts) {
        products = [...products, ...newProducts];
      }
    });

    if (products.length) {
      const { parent } = node;
      const classes = parent && parent.attribs && parent.attribs.class;
      const isGrid = classes && (classes.indexOf('grid') > -1);
      if (isGrid) {
        const columnClass = classes && (classes.indexOf('one-by-') > -1);
        let displayMode = ProductCardDisplayMode.OneBySix;
        if (columnClass) {
          if (classes.indexOf('one-by-three') > -1) {
            displayMode = ProductCardDisplayMode.OneByThree;
          } else if (classes.indexOf('one-by-two') > -1) {
            displayMode = ProductCardDisplayMode.OneByTwo;
          }
        }
        return ProductListView(isGrid, products, index, displayMode);
      }
      return ProductCarouselView(products, index);
    }

    return undefined;
  };

  const inferProduct = (node, index) => {
    if (node.attribs && node.attribs.class && node.attribs.class.startsWith('product-item-info')) {
      const len = node.children.length;
      for (let i = 0; i < len; i += 1) {
        const childNode = node.children[i];
        if (childNode.attribs && childNode.attribs.href) {
          const url = childNode.attribs.href;
          let newUrl = url || '';

          if (newUrl.startsWith(baseLinkUrl)) {
            newUrl = newUrl.split('').splice(baseLinkUrl.length).join('');
          }

          if (newUrl.startsWith(secureBaseLinkUrl)) {
            newUrl = newUrl.split('').splice(secureBaseLinkUrl.length).join('');
          }

          if (newUrl.endsWith(productUrlSuffix)) {
            newUrl = newUrl.split('').slice(0, productUrlSuffix.length * -1).join('');
          }

          if (newUrl.startsWith('/')) {
            newUrl = newUrl.split('').splice(1).join('');
          }

          return [newUrl];
        }
      }
    }

    if (node.children) {
      let products = [];
      node.children.forEach((childNode) => {
        const newItems = inferProduct(childNode, index);
        if (newItems) {
          products = [...products, ...newItems];
        }
      });

      if (products.length) {
        return products;
      }
    }

    return null;
  };

  const transformImage = (node, index) => {
    const {
      src, alt, classes, width, height, style,
    } = node.attribs;
    return (
      <ImageView
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={classes}
        key={index}
      />
    );
  };

  const transformLink = (node, index) => {
    const { href = '' } = node.attribs;

    // both baseLinkUrl and baseStaticUrl have same prefix,
    // so its important we check this first
    if (href.startsWith(baseStaticUrl)) {
      return undefined;
    }

    if (href.startsWith(baseMediaUrl)) {
      return undefined;
    }

    if (href.startsWith(baseLinkUrl) || href.startsWith(secureBaseLinkUrl)) {
      let newUrl = href.startsWith(baseLinkUrl) ? href.replace(baseLinkUrl, '') : href.replace(secureBaseLinkUrl, '');
      if (!newUrl.startsWith('/')) {
        newUrl = `/${newUrl}`;
      }
      const { classes } = node.attribs;
      const attrs = {
        href: newUrl,
        className: classes,
      };

      let children = '';
      if (node.children.length === 1 && node.children[0].type === 'text') {
        children = (<a>{node.children[0].data}</a>);
      } else {
        children = (
          <a>
            {node.children.map((childNode, i) => convertNodeToElement(childNode, i, transform))}
          </a>
        );
      }

      return (
        <Link
          {...attrs}
          key={index}
          prefetch={false}
        >
          {children}
        </Link>
      );
    }

    return undefined;
  };

  return transform;
}

const MagentoHtml = ({ html }) => {
  const data = useContext(StoreConfigContext);

  const transform = transformBuilder(data.storeConfig);
  const node = ReactHtmlParser(html, { transform });
  return (
    <div className="rz-magento-html">
      {node}
    </div>
  );
};

MagentoHtml.propTypes = {
  html: PropTypes.string,
};

export default MagentoHtml;
