import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Config from '@/config';
import { StoreConfigContext } from '@/store/core/context';
import { buildPageTitle } from '@/roanuz/lib/content';
import { withDependencySupport } from './lib/dep';

export const BaseDefaultHead = () => (
  <Head>
    <meta name="x-made-by" content="♥♥♥ Developed by Roanuz (www.roanuz.com) ♥♥♥" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
    {(!Config.EnableSEO) && (
      <meta name="robots" content="noindex" key="robots" />
    )}

    {Config.PreConnectUrls && (
      Config.PreConnectUrls.map((url, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <link href={url} rel="preconnect" key={`pc-${i}`} />
      ))
    )}
  </Head>
);

export const BaseAdditionalHead = () => (
  <Head>
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      key="gs-font-pc"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&display=swap"
      rel="stylesheet"
      key="gs-font"
    />
    <link rel="shortcut icon" href="/tl-logo.png" type="image/x-icon" key="shortcut" />
    <link rel="icon" href="/tl-logo.png" type="image/x-icon" key="icon" />
  </Head>
);

export const BaseSEOHead = ({
  title,
  desc,
  keywords,
}) => {
  const { storeConfig } = useContext(StoreConfigContext);
  const pageTitle = buildPageTitle(
    title,
    storeConfig,
  );
  const pageDesc = (desc) ? [desc] : [];
  pageDesc.push(storeConfig.default_description);

  const pageKeywords = (keywords) ? [keywords] : [];
  pageKeywords.push(storeConfig.default_keywords);

  return (
    <Head>
      <title key="title">
        {pageTitle}
      </title>
      <meta
        name="title"
        content={pageTitle}
        key="meta_title"
      />
      <meta
        property="og:title"
        content={pageTitle}
        key="og_title"
      />
      <meta
        name="description"
        content={pageDesc.join('. ')}
        key="meta_description"
      />
      <meta
        property="og:description"
        content={pageDesc.join('. ')}
        key="og_description"
      />
      <meta
        name="keywords"
        content={pageKeywords.join(' ')}
        key="meta_keywords"
      />
    </Head>
  );
};

BaseSEOHead.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  keywords: PropTypes.string,
};

export const DefaultHead = withDependencySupport(BaseDefaultHead, 'DefaultHead');
export const SEOHead = withDependencySupport(BaseSEOHead, 'SEOHead');
export const AdditionalHead = withDependencySupport(BaseAdditionalHead, 'AdditionalHead');
