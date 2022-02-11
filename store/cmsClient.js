import { useMemo } from 'react';
import {
  ApolloClient, InMemoryCache,
  HttpLink,
} from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setContext } from '@apollo/client/link/context';

import Config from '@/config';
import possibleTypes from '@/graphql/possibleTypes.json';

const apolloClient = { instance: null };

const authLink = (userToken) => setContext((request, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: Config.CMSKey,
    },
  };
});

function createIsomorphLink() {
  return new HttpLink({
    uri: Config.CMSUrl,
    credentials: 'same-origin',
  });
}

function createApolloClient(userToken) {
  const link = authLink(userToken).concat(createIsomorphLink());
  console.log('⚡️⚡️ New Apollo', userToken);
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

export function initCmsApollo(
  initialState = null,
  userToken = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
) {
  const newApolloClient = apolloClient.instance ?? createApolloClient(userToken);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    console.log('🧲🧲 Restoring Apollo data');
    newApolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  // if (typeof window === 'undefined') return newApolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient.instance) apolloClient.instance = newApolloClient;

  return newApolloClient;
}

export function useCmsApollo(initialState, userToken, oldApolloClient) {
  if (oldApolloClient) {
    if (!apolloClient.instance) {
      apolloClient.instance = apolloClient;
    }
    return useMemo(() => oldApolloClient, [oldApolloClient]);
  }
  const store = useMemo(() => initCmsApollo(initialState, userToken), [initialState, userToken]);
  return store;
}
