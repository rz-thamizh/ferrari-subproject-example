import { useMemo } from 'react';
import {
  ApolloClient, InMemoryCache,
  HttpLink,
  ApolloLink,
  from as linkFrom,
} from '@apollo/client';

// eslint-disable-next-line import/no-extraneous-dependencies
import { setContext } from '@apollo/client/link/context';

import Config from '@/config';
import possibleTypes from '@/graphql/possibleTypes.json';
import { CookieManager } from '@/lib/cookie';

// const apolloClient = { instance: null };
const logLink = new ApolloLink((operation, forward) => {
  // const timerName = `===>⏳ Request - ${operation.operationName}`;
  // console.time(timerName);
  const startedAt = (new Date()).getTime();
  return forward(operation).map((result) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;
    const cacheTag = (headers && headers.get('x-cache')) || 'N/A';
    const totalTime = (new Date()).getTime() - startedAt;
    console.log(`===>⏳ Cache Tag ${operation.operationName}: ${cacheTag} ${totalTime}ms`);
    // console.timeEnd(timerName);
    return result;
  });
});

const authLink = (userToken) => setContext((request, { headers }) => {
  let token = userToken;
  if (typeof window !== 'undefined') {
    // Fetch from cookie if its client side;
    token = CookieManager.get('roanuz_user_token');
  }
  return {
    headers: {
      ...headers,
      store: Config.StoreViewCode,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

function createIsomorphLink() {
  return new HttpLink({
    uri: Config.BackendPath,
    credentials: 'same-origin',
  });
}

function createApolloClient(userToken, initialState) {
  // const link = authLink(userToken).concat(createIsomorphLink());
  const links = [
    authLink(userToken),
    createIsomorphLink(),
  ];

  if (!Config.IsProd) {
    links.unshift(logLink);
  }
  const link = linkFrom(links);

  let cache = new InMemoryCache({
    // possibleTypes: InterfaceTyes,
    possibleTypes,
    typePolicies: {
      CmsBlock: {
        keyFields: ['identifier'],
      },
      CustomizableProductInterface: {
        keyFields: ['url_key'],
      },
      PhysicalProductInterface: {
        keyFields: ['url_key'],
      },
    },
  });
  if (initialState) {
    console.log('🧲🧲 Restoring Apollo data');
    cache = cache.restore(initialState);
  } else {
    console.log('⚡️⚡️ New Apollo', userToken);
  }

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    ssrForceFetchDelay: (typeof window === 'undefined') ? 0 : 100,
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        // fetchPolicy: 'cache-and-network',
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

export function initApollo(
  initialState = null,
  userToken = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
) {
  return createApolloClient(userToken, initialState);
}

export function useApollo(initialState, userToken) {
  const store = useMemo(() => initApollo(initialState, userToken), [initialState, userToken]);
  return store;
}
