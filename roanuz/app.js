import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getDataFromTree } from '@apollo/client/react/ssr';
import { ApolloProvider } from '@apollo/client';
import { initApollo } from '@/store/apolloClient';
import { PageTypes } from '@/roanuz/types';
import { defaultUserState } from '@/store/core/context';

import {
  dependencyRegister,
// eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/any';

import { getDisplayName } from './lib/utils';

export function withFullTree(PageComponent) {
  const WithFullTree = (props) => {
    // eslint-disable-next-line react/prop-types
    const { apolloClient, apolloState, ...pageProps } = props;

    dependencyRegister(PageTypes.ANY);

    // eslint-disable-next-line react/prop-types
    const client = apolloClient || initApollo(apolloState ? apolloState.data : null);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  const displayName = getDisplayName(PageComponent);
  WithFullTree.displayName = `withFullTree(${displayName})`;

  WithFullTree.getInitialProps = async (ctx) => {
    console.log('Get init Prop', ctx.ctx.asPath);
    ctx.apolloClient = ctx.apolloClient || initApollo(null);
    const { apolloClient } = ctx;
    const { AppTree } = ctx;
    const isInAppContext = 'Component' in ctx;

    dependencyRegister(PageTypes.ANY);
    const apolloState = { data: {} };
    const userContext = defaultUserState();

    let pageProps = {};
    if (PageComponent.getInitialProps) {
      pageProps = { ...pageProps, ...(await PageComponent.getInitialProps(ctx)) };
    }

    const appProps = {
      apolloState,
      userContext,
      pageProps,
    };

    if (typeof window !== 'undefined') {
      return appProps;
    }

    if (ctx.res && (ctx.res.headersSent || ctx.res.writableEnded)) {
      console.log('Skipping Apollo Tree Restore');
      return appProps;
    }

    let props;
    if (isInAppContext) {
      props = { ...appProps };
    } else {
      props = { pageProps: { ...appProps } };
    }

    try {
      const startedAt = (new Date()).getTime();
      await getDataFromTree((
        <AppTree {...props} apolloClient={apolloClient} />
      ));
      const totalTime = (new Date()).getTime() - startedAt;
      console.log(`===>⏳ Page Rendered in ${totalTime}ms`);
    } catch (error) {
      // Prevent Apollo Client GraphQL errors from crashing SSR.
      // Handle them in components via the data.error prop:
      // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
      console.error('Error while running `getDataFromTree`', error);
    }
    // getDataFromTree does not call componentWillUnmount
    // head side effect therefore need to be cleared manually
    // Head.rewind();

    apolloState.data = apolloClient.cache.extract();
    // apolloState.data = apolloClient.extract();

    return {
      ...appProps,
    };
  };

  return WithFullTree;
}
