import Config from '@/config';
import { useQuery } from '@apollo/client';
import {
  AllWidgetsQuery,
  AllWidgetsByThemeQuery,
  WidgetListQuery,
  WidgetsQuery,
  WidgetsByThemeQuery,
} from './query';

import {
  findLayoutContainer,
} from './layout';

export const fetchWidgetData = async (apolloClient) => {
  const query = Config.BackendThemeId ? AllWidgetsByThemeQuery : AllWidgetsQuery;
  const variables = Config.BackendThemeId ? { id: parseInt(Config.BackendThemeId, 10) } : {};
  const lookupVariable = Config.BackendThemeId ? 'widgetIdsByTheme' : 'widgetIds';
  const widgetIdsData = await apolloClient.query({
    query,
    variables,
  });

  let storeWidgets = [];
  let storeWidgetIds = [];
  if (widgetIdsData.data && widgetIdsData.data[lookupVariable]) {
    storeWidgetIds = widgetIdsData.data[lookupVariable].map((x) => x.id);
  }
  const pageIds = [...storeWidgetIds];

  const queries = [];
  while (pageIds.length > 0) {
    const ids = pageIds.splice(0, 10);
    queries.push(
      apolloClient.query({ query: WidgetListQuery, variables: { ids } }),
    );
  }

  if (queries) {
    const widgetsData = await Promise.all(queries);
    storeWidgets = widgetsData.map((widget) => widget.data.widgetList.map((x) => x)).flat();
  }

  return { storeWidgetIds, storeWidgets };
};

export const useStoreWidgets = (apolloClient) => {
  const query = Config.BackendThemeId ? WidgetsByThemeQuery : WidgetsQuery;
  const variables = Config.BackendThemeId ? { id: parseInt(Config.BackendThemeId, 10) } : {};
  const lookupVariable = Config.BackendThemeId ? 'widgetsByTheme' : 'widgets';
  const {
    loading,
    error,
    data,
  } = useQuery(query, { variables, client: apolloClient });

  return {
    loading,
    error,
    data: data && data[lookupVariable],
  };
};

export const filterWidgets = (storeWidgets, {
  handles = [],
  pageFor = 'all',
  group = null,
  entity = null,
  merge = null,
}) => {
  const widgets = merge || {};
  storeWidgets.forEach((widget) => {
    widget.page_groups.forEach((pageGroup) => {
      let fullfilled = true;

      if (fullfilled && handles && handles.length > 0) {
        fullfilled = handles.indexOf(pageGroup.layout_handle) > -1;
      }

      if (fullfilled && pageFor) {
        fullfilled = pageGroup.page_for === pageFor;
      }

      if (fullfilled && group) {
        fullfilled = pageGroup.page_group === group;
      }

      if (fullfilled && entity) {
        if (pageGroup.entities) {
          const entities = pageGroup.entities.split(',');
          fullfilled = entities.indexOf(entity) > -1;
        } else {
          fullfilled = false;
        }
      }

      if (fullfilled) {
        const container = findLayoutContainer(pageGroup.block_reference);
        if (!widgets[container]) {
          widgets[container] = [];
        }

        widgets[container].push({ pageGroup, widget });
      }
    });
  });

  Object.keys(widgets).forEach((key) => {
    widgets[key].sort((x, y) => x.widget.sort_order - y.widget.sort_order);
  });

  return widgets;
};

export const defaultWidgets = async () => {
  const { storeWidgets } = await fetchWidgetData();
  return filterWidgets(storeWidgets, { handles: ['default'] });
};

export const filterPageWidgets = ({ widgets, isHome }) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  let handles = [
    'cms_page_view', // All CMS pages
  ];

  if (isHome) {
    handles += ['cms_index_defaultindex', 'cms_index_index'];
  }

  filteredWidgets = filterWidgets(widgets, {
    handles, pageFor: 'all', merge: filteredWidgets,
  });

  return filteredWidgets;
};

export const filterCategoryWidgets = ({ widgets, category }) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  const entity = `${category.id}`;
  let group = 'anchor_categories';
  if (!category.is_anchor) {
    group = 'notanchor_categories';
    // group = 'anchor_categories';
  }

  filteredWidgets = filterWidgets(widgets, {
    pageFor: 'all',
    group,
    merge: filteredWidgets,
  });

  filteredWidgets = filterWidgets(widgets, {
    pageFor: 'specific',
    entity,
    group,
    merge: filteredWidgets,
  });

  return filteredWidgets;
};

export const filterProductWidgets = ({ widgets, product }) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  if (!product) {
    return filteredWidgets;
  }

  const entity = `${product.id}`;
  let productType = 'simple_products';

  // eslint-disable-next-line no-underscore-dangle
  switch (product.__typename) {
    case 'VirtualProduct':
      productType = 'virtual_products';
      break;
    case 'BundleProduct':
      productType = 'bundle_products';
      break;
    case 'ConfigurableProduct':
      productType = 'configurable_products';
      break;
    case 'DownloadableProduct':
      productType = 'downloadable_products';
      break;
    case 'GroupedProduct':
      productType = 'grouped_products';
      break;
    default:
      productType = 'simple_products';
  }

  filteredWidgets = filterWidgets(widgets, {
    pageFor: 'all',
    group: 'all_products',
    merge: filteredWidgets,
  });

  filteredWidgets = filterWidgets(widgets, {
    pageFor: 'all',
    group: productType,
    merge: filteredWidgets,
  });

  filteredWidgets = filterWidgets(widgets, {
    pageFor: 'specific',
    group: 'all_products',
    entity,
    merge: filteredWidgets,
  });

  filteredWidgets = filterWidgets(widgets, {
    pageFor: 'specific',
    group: productType,
    entity,
    merge: filteredWidgets,
  });

  return filteredWidgets;
};

export const filterCartWidgets = ({
  widgets, cart, shippingPage,
}) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  let handles = [
    'checkout_index_index', // All Checkout pages
  ];

  if (shippingPage) {
    handles += ['checkout_onepage_shippingmethod'];
  }
  // Other Possible pages
  // checkout_onepage_paymentmethod
  // checkout_onepage_failure
  // checkout_onepage_review
  // checkout_onepage_success

  filteredWidgets = filterWidgets(widgets, {
    handles, pageFor: 'all', merge: filteredWidgets,
  });

  return filteredWidgets;
};

export const filterRegisterWidgets = ({
  widgets,
}) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  const handles = [
    'customer_account_create',
  ];

  filteredWidgets = filterWidgets(widgets, {
    handles, pageFor: 'all', merge: filteredWidgets,
  });

  return filteredWidgets;
};

export const filterLoginWidgets = ({
  widgets,
}) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  const handles = [
    'customer_account_login',
  ];

  filteredWidgets = filterWidgets(widgets, {
    handles, pageFor: 'all', merge: filteredWidgets,
  });

  return filteredWidgets;
};

export const filterMyAccountWidgets = ({
  widgets,
}) => {
  let filteredWidgets = filterWidgets(widgets, {
    handles: ['default'],
  });

  const handles = [
    'customer_account_index',
  ];

  filteredWidgets = filterWidgets(widgets, {
    handles, pageFor: 'all', merge: filteredWidgets,
  });

  return filteredWidgets;
};
