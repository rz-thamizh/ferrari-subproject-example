import { formatPriceLabel, formatLabel } from '@/roanuz/lib/cart';

export function parseRouterFilterItems(router) {
  const routerUrlPaths = router.asPath.split('?');
  const queryPath = routerUrlPaths[1];

  const urlSearchParams = new URLSearchParams(unescape(queryPath)); // window.location.search
  const routerQueryParams = Object.fromEntries(urlSearchParams.entries());
  return routerQueryParams;
}

export function pushFilterItem(container, aggregationCode, option) {
  const item = {};
  item.count = option.count;
  if (aggregationCode === 'price') {
    item.label = formatPriceLabel(option.label);
  } else {
    item.label = formatLabel(option.label);
  }
  return {
    ...container[aggregationCode], [option.value]: item,
  };
}

export function parseInitialAggregationItemCount(aggregations, shouldRestrict = null) {
  const counts = {};
  aggregations.forEach((aggregation) => {
    const aggregationCode = aggregation.attribute_code;
    const { options } = aggregation;
    options.forEach((option) => {
      if (shouldRestrict) {
        if (shouldRestrict === aggregationCode) {
          counts[aggregationCode] = pushFilterItem(counts, aggregationCode, option);
        }
      } else {
        counts[aggregationCode] = pushFilterItem(counts, aggregationCode, option);
      }
    });
  });
  return counts;
}

export function mergeAggregation(
  initialCount, liveUpdate, activeFilter,
  params, forceWriting,
) {
  const liveUpdateFormat = parseInitialAggregationItemCount(liveUpdate);
  const counts = { ...initialCount };
  const initialAttributes = Object.keys(counts);
  const liveUpdateAttributes = Object.keys(liveUpdateFormat);
  liveUpdate.forEach((aggregation) => {
    const aggregationCode = aggregation.attribute_code;
    const { options } = aggregation;
    const initialAttrItemValues = Object.keys(counts[aggregationCode] || []);
    const liveUpdateAttrItemValues = Object.keys(liveUpdateFormat[aggregationCode]);
    const missingAttributeItems = initialAttrItemValues
      .filter((e) => !liveUpdateAttrItemValues.includes(e));

    // Update all attributes group except active
    if (activeFilter === '' || activeFilter !== aggregationCode) {
      options.forEach((option) => {
        if (counts[aggregationCode] && counts[aggregationCode][option.value]) {
          counts[aggregationCode][option.value].count = option.count;
        } else {
          counts[aggregationCode] = { ...counts[aggregationCode] };
          counts[aggregationCode] = pushFilterItem(counts, aggregationCode, option);
        }
        delete counts[aggregationCode].attributeMissing;
      });
    }

    // Identify attributes no longer have products
    const missingAttributes = initialAttributes.filter((e) => !liveUpdateAttributes.includes(e));
    if (missingAttributes.length) {
      missingAttributes.forEach((s) => {
        counts[s].attributeMissing = true;
      });
    }
    // if ((activeFilter && activeFilter !== aggregationCode) || activeFilter === null) {
    //   missingAttributeItems.forEach((s) => {
    //     if (counts[aggregationCode][s]) {
    //       counts[aggregationCode][s].count = 0;
    //     }
    //   });
    // }
    missingAttributeItems.forEach((s) => {
      if (counts[aggregationCode][s] && !forceWriting) {
        if (activeFilter !== '') {
          if ((activeFilter !== aggregationCode) || activeFilter === null) {
            counts[aggregationCode][s].count = 0;
          }
        } else {
          const aCode = params[aggregationCode];
          if (aCode) {
            if (aCode.split(',').length > 1) {
              counts[aggregationCode][s].count = 0;
            }
          }
        }
      }
    });
  });
  return counts;
}
