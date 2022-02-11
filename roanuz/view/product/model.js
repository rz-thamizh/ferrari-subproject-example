import Config from '@/config';
import { Utils } from '@/lib/utils';
import { LabelKind } from './label';
import { formatCurrency, formatNumber } from '../../lib/cart';
import { makeStockStatusV2, AvailableStatus, StockStatus } from './models/stock';

export function createEnergyLabelIconUrl(name) {
  if (!name) return null;

  const parsed = `${name}`.toLowerCase()
    .replace(/\s/g, '-')
    .replace(/_/g, '-')
    .replace(/\+/g, 'plus');
  const basePath = `energy_labels/${parsed}.svg`;
  return Utils.mergePaths([Config.AssetsPath, basePath]);
}

export function parseGallery(product) {
  const energyLabelKey = 'rz_energy_label';
  const gallery = [];
  let energyLabelImage = null;

  if (product.media_gallery) {
    product.media_gallery.forEach((item) => {
      if (item.disabled) {
        return;
      }

      if (item.label === energyLabelKey) {
        energyLabelImage = item;
      } else {
        // A bug in backend which is saving product witout label attribute,
        // using filename as a hot fix
        const parts = item.url.split('.');
        const cParts = parts[parts.length - 2].split('_');
        const lastPart = cParts[cParts.length - 1];
        if (lastPart.toLowerCase() === 'label') {
          energyLabelImage = item;
        } else {
          gallery.push(item);
        }
      }
    });
  }

  return [energyLabelImage, gallery];
}

export function parseGalleryMeta(meta) {
  let items = 0;
  let hasEnergyLabel = false;
  let version = null;

  if (meta) {
    const parts = meta.split(';');
    items = (parts.length > 0) ? parseInt(parts[0], 10) : 0;
    hasEnergyLabel = (parts.length > 1) ? parts[1] === '1' : false;
    version = (parts.length > 2) ? parts[2] : null;

    if (hasEnergyLabel) {
      items -= 1;
    }
  }

  return {
    items, hasEnergyLabel, version,
  };
}

export function buildProductImageUrl(product, index, type, version) {
  const fileName = `${type}_${index || 0}.jpeg`;
  if (version) {
    return `${Config.ProductImagePath}${product.sku}/${version}/web/${fileName}`;
  }
  return `${Config.ProductImagePath}${product.sku}/web/${fileName}`;
}

function buildImageData(url, label) {
  return {
    url,
    label,
    disabled: false,
  };
}

export function buildProductImageUrlSmall(product, index, version) {
  return buildImageData(buildProductImageUrl(product, index, Config.ProductImageSmallSize, version), `product image ${index}`);
}

export function buildProductImageUrlLarge(product, index, version) {
  return buildImageData(buildProductImageUrl(product, index, 'large2x', version), `product image ${index}`);
}

export function buildProductImageUrlEnergyLabel(product, version) {
  return buildImageData(buildProductImageUrl(product, 'label', 'large2x', version), 'product energy label');
}

export function productImageForSuggestion(hit) {
  if (Config.UseImagePathForSuggestion && hit.rz_gallery_meta) {
    const meta = parseGalleryMeta(hit.rz_gallery_meta);
    return buildProductImageUrlSmall(hit, 0, meta.version).url;
  }

  return hit.image_url;
}

export function prepareGalleryData(product, galleryFetched) {
  let [labelImage, images] = parseGallery(product);
  let { image } = product;
  let smallImage = image;
  let hasImage = (product.image && (product.image.disabled !== true));
  let hasEnergyLabel = labelImage !== null;

  if (product.rz_gallery_meta) {
    const {
      items,
      version,
      hasEnergyLabel: hasLabelImage,
    } = parseGalleryMeta(product.rz_gallery_meta);

    hasEnergyLabel = hasLabelImage;

    if (items > 0) {
      hasImage = true;
      smallImage = buildProductImageUrlSmall(product, 0, version);
      image = buildProductImageUrlLarge(product, 0, version);
    }

    if (hasEnergyLabel) {
      labelImage = buildProductImageUrlEnergyLabel(product, version);
    }

    images = [];
    for (let i = 0; i < items; i += 1) {
      const data = {
        position: i,
        ...buildProductImageUrlLarge(product, i, version),
      };
      images.push(data);
    }
  }

  const gallery = {
    hasImage,
    smallImage,
    image,
    hasEnergyLabel,
    galleryFetched,
    energyLabelImage: labelImage,
    images,
    hasRzGalleryMeta: product.rz_gallery_meta,
  };

  // console.log('Gallery', gallery, product.rz_gallery_meta);

  return gallery;
}

export function makeStockStatus(product, hasPrice, attributeMeta) {
  // Sorry i can't make this code better readable
  // because the business logic itself is complex
  /*
    Verslun(Store)
      Green: Available in all stores
      Yellow: Available in some stores
      Gray: not available in any store

    Vefur(webshop)
      Green: Available in warehouse
      Yellow: Not available in warehouse but available in some stores
      Gray:  Not available anywhere

  */

  let onStore = AvailableStatus.NO;
  let onWeb = AvailableStatus.NO;
  let status = product.stock_status === 'IN_STOCK' ? StockStatus.IN_STOCK : null;
  let storesStatus = [];
  let showPieceStores = [];
  const warehouseKey = 'warehouse';

  let rzShowPieceStoresList = null;
  if (attributeMeta && attributeMeta.rzShowPieceStores
    && attributeMeta.rzShowPieceStores.customAttributeMetadata) {
    rzShowPieceStoresList = attributeMeta
      .rzShowPieceStores.customAttributeMetadata.items[0].attribute_options;
  }
  if (rzShowPieceStoresList && rzShowPieceStoresList.length && product.rz_show_piece_stores) {
    const parts = product.rz_show_piece_stores.split(',').map((x) => parseInt(x, 10));
    showPieceStores = rzShowPieceStoresList
      .filter((str) => parts.includes(parseInt(str.value, 10)));
  }

  if (product.rzMultiStockStatus && product.rzMultiStockStatus.sources.length > 0) {
    const { sources } = product.rzMultiStockStatus;
    const webStatus = sources.find((x) => x.code === warehouseKey);
    const stores = sources.filter((x) => x.code !== warehouseKey);

    const totalStores = stores.length;
    const availableStores = stores.filter((x) => x.stock_status === StockStatus.IN_STOCK).length;

    if (availableStores === 0) {
      onStore = AvailableStatus.NO;
    } else if (totalStores === availableStores) {
      onStore = AvailableStatus.YES;
    } else {
      onStore = AvailableStatus.YELLOW;
    }

    if (webStatus) {
      const ss = webStatus.stock_status;
      if (ss === StockStatus.IN_STOCK) {
        onWeb = AvailableStatus.YES;
      } else if (onStore === AvailableStatus.NO) {
        onWeb = AvailableStatus.NO;
      } else {
        onWeb = AvailableStatus.YELLOW;
      }

      storesStatus = [webStatus];
    } else if (onStore === AvailableStatus.YES) {
      onWeb = AvailableStatus.YELLOW;
    } else {
      onWeb = onStore;
    }

    storesStatus = [
      ...storesStatus,
      ...stores,
    ];

    // Identify Status for each location
    storesStatus = storesStatus.map((s) => {
      const sStatus = (s.stock_status === StockStatus.IN_STOCK)
        ? AvailableStatus.YES
        : AvailableStatus.NO;
      return { ...s, status: sStatus };
    });

    // Special Case for warehouse
    if (storesStatus.length
       && storesStatus[0].code === warehouseKey
       && storesStatus[0].status === AvailableStatus.NO
       && onStore !== AvailableStatus.NO
    ) {
      storesStatus[0].status = AvailableStatus.YELLOW;
    }

    // Identify Product Status
    if (!hasPrice) {
      status = StockStatus.SPECIAL_ORDER;
      storesStatus = [
        { status: AvailableStatus.NO, name: 'Sérpöntun' },
      ];
    } else if (sources.filter((x) => x.stock_status === StockStatus.IN_STOCK).length > 0) {
      status = StockStatus.IN_STOCK;
    } else if (sources.filter((x) => x.stock_status === StockStatus.AVAILABLE_SOON).length > 0) {
      status = StockStatus.AVAILABLE_SOON;
      storesStatus = [
        { status: AvailableStatus.NO, name: 'Í pöntun' },
      ];
    } else {
      status = StockStatus.SOLD_OUT;
      storesStatus = [
        { status: AvailableStatus.NO, name: 'Sérpöntun' },
      ];
    }
  }

  return {
    onStore,
    onWeb,
    status,
    storesStatus,
    showPieceStores,
  };
}

// We are doing this because the last sub category is missing in breadcrumbs.
// And we can't use the product.category.url_path since wrong data coming from magento.
// Wrong data in sense, if same product available in two stores, dats is structured wrongly.
function fixBreadcrumbs(category) {
  const breadcrumbRef = [...category.breadcrumbs];
  const { preferredCategory } = category;
  const preferredCategoryInfo = {
    category_level: 4, // For safe side, no need but.
    category_name: preferredCategory.name,
    category_uid: preferredCategory.uid,
    category_url_key: preferredCategory.url_key,
    category_url_path: preferredCategory.url_path,
  };
  breadcrumbRef.push(preferredCategoryInfo);
  return breadcrumbRef;
}

export function parseProduct(product, attributeMeta, storeConfig) {
  const maxPrice = product.price_range.maximum_price;
  let minPriceBase = product.price_range.minimum_price;

  // For B2B price change Begin
  const hasPriceTiers = product.price_tiers && product.price_tiers.length;
  if (hasPriceTiers) {
    const priceTiers = { ...product.price_tiers[0] };
    if (priceTiers.final_price.value < minPriceBase.final_price.value) {
      priceTiers.regular_price = product.price_range.minimum_price.regular_price;
      minPriceBase = priceTiers;
    }
  }
  // For B2B End
  const minPrice = minPriceBase;

  const hasVariablePrice = (
    (maxPrice.final_price.value !== minPrice.final_price.value)
    && !hasPriceTiers
  );
  const onSale = product.sale === 1;
  const hasDiscountAmount = minPrice.discount.amount_off !== 0
    && (minPrice.discount.amount_off > Config.ShowPercentageForDiscountUnder);
  const hasDiscountPerc = minPrice.discount.percent_off !== 0;
  const onDiscount = hasDiscountAmount || hasDiscountPerc;
  const isNew = product.new === 1;
  const shortDesc = product.short_description ? product.short_description.html : null;
  const detailDesc = product.description ? product.description.html : null;
  const upsellProducts = product.upsell_products;
  const crosssellProducts = product.crosssell_products;
  const relatedProducts = product.related_products;
  const configOptions = [...(product.configurable_options || [])]
    .sort((x, y) => x.position - y.position);
  const options = [...(product.options || [])];
  let bundledItemOptions = [];
  // eslint-disable-next-line no-underscore-dangle
  if (product.__typename === 'BundleProduct') {
    bundledItemOptions = [...(product.items || [])];
  }

  let groupedProducts = [];
  // eslint-disable-next-line no-underscore-dangle
  if (product.__typename === 'GroupedProduct') {
    groupedProducts = [...(product.items || [])];
  }

  const available = product.stock_status === 'IN_STOCK';

  let category = null;
  const hasImage = (product.image && (product.image.disabled !== true));
  const productLink = `/${product.url_key}${product.url_suffix}`;

  const {
    name, sku, image,
  } = product;

  // const rzSmallImage = product.rzSmallImageUrl || null;

  const manufacturer = product.rz_manufacturer;

  const { value: price, currency } = minPrice.final_price;
  const priceText = formatCurrency(price, currency);
  let regPriceText = null;
  let discountText = null;
  const hasPrice = price > 0.1;

  const isRefurbished = product.rz_b_product === 1;
  const refurbishedNotes = product.rz_b_product_description;
  const energyLabel = product.rz_energy_label;
  const energyLabelIcon = createEnergyLabelIconUrl(product.rz_energy_label);

  const productUrlKey = product.url_key;

  let label = null;
  let labelKind = LabelKind.Label;

  if (!label) {
    if (onDiscount || onSale) {
      label = 'Tilboð';
      labelKind = LabelKind.Discount;

      if (isNew) {
        label = 'Kynningartilboð';
        labelKind = LabelKind.Sale;
      }
    } else if (isRefurbished) {
      label = 'B-vörur';
      labelKind = LabelKind.Refurbished;
    } else if (isNew) {
      label = 'Nýtt';
      labelKind = LabelKind.New;
    }
  }

  if (onDiscount) {
    regPriceText = formatCurrency(minPrice.regular_price.value, minPrice.regular_price.currency);
    if (hasDiscountAmount) {
      const amount = formatCurrency(minPrice.discount.amount_off, minPrice.regular_price.currency);
      discountText = `${amount}`;
    } else {
      discountText = `${formatNumber(minPrice.discount.percent_off, true)}%`;
    }
  }

  const stockStatus = Config.Features.EnableDatoCMS
    ? makeStockStatusV2(product, hasPrice, attributeMeta, storeConfig)
    : makeStockStatus(product, hasPrice, attributeMeta);

  let categories = [...(product.categories || [])];
  categories = categories.reverse();

  let preferredCategory = null;

  const { listOfAllChildCategories } = storeConfig.categoryTreeData;
  categories.forEach((possibleCat) => {
    if (!category && listOfAllChildCategories.includes(possibleCat.id)) {
      category = { ...possibleCat };
      preferredCategory = category;
      category.breadcrumbs = possibleCat.breadcrumbs || [];
      return;
    }

    if (listOfAllChildCategories.includes(possibleCat.id)) {
      if (possibleCat.breadcrumbs
        && possibleCat.breadcrumbs.length >= category.breadcrumbs.length) {
        preferredCategory = possibleCat;
        category.breadcrumbs = possibleCat.breadcrumbs;
      }
    }
  });

  if (preferredCategory) {
    category.preferredCategory = preferredCategory;
    category.breadcrumbs = fixBreadcrumbs(category);
  }
  const gallery = prepareGalleryData(product, false);
  const volume = product.rz_volume ? parseFloat(product.rz_volume) : null;
  const assembleDays = product.rz_assembly_days ? parseInt(product.rz_assembly_days, 10) : null;

  return {
    // ...product,
    id: product.id,
    price,
    hasPrice,
    currency,
    maxPrice,
    minPrice,
    hasVariablePrice,
    hasDiscountAmount,
    hasDiscountPerc,
    onSale,
    onDiscount,
    isNew,
    isRefurbished,
    refurbishedNotes,
    energyLabel,
    energyLabelIcon,
    label,
    labelKind,
    name,
    sku,
    priceText,
    regPriceText,
    discountText,
    available,
    stockStatus,
    hasImage,
    productLink,
    category,
    brandId: manufacturer,
    shortDesc,
    detailDesc,
    image,
    gallery,
    upsellProducts,
    crosssellProducts,
    relatedProducts,
    configOptions,
    options,
    groupedProducts,
    bundledItemOptions,
    productUrlKey,
    volume,
    assembleDays,
  };
}

export function parseProductDetail(product, attributeMeta, productLiveUpdates, storeConfig) {
  let merged = {
    ...product,
  };

  if (productLiveUpdates) {
    merged = {
      ...product,
      ...productLiveUpdates,
    };
  }
  const parsed = parseProduct(merged, attributeMeta, storeConfig);
  parsed.gallery.galleryFetched = true;
  // const [energyLabelImage, gallery] = parseGallery(product);

  const displayShops = product.rz_display_shops;
  const returnDays = product.rz_return_days;
  const crossSellAsOption = product.rz_cross_sell_as_option;
  const galleryVideo = product.media_gallery
    .filter((x) => x.video_content && x.video_content.video_url);

  return {
    ...parsed,
    // gallery,
    displayShops,
    returnDays,
    crossSellAsOption,
    // energyLabelImage,
    galleryVideo,
  };
}

export function buildSeoStructuredData(product) {
  const descText = product.shortDesc.replace(/(<([^>]+)>)/gi, '');
  const images = product.gallery.images.map((item) => item.url);
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: descText,
    sku: product.sku,
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '5',
      lowPrice: '119.99',
      highPrice: '199.99',
      priceCurrency: 'USD',
    },
  };

  if (images) {
    structuredData.image = images;
  }

  if (product.brandId) {
    structuredData.brand = {
      '@type': 'Brand',
      name: `${product.brandId}`.toUpperCase(),
    };
  }

  if (product.hasPrice) {
    let availability = null;
    const itemCondition = 'https://schema.org/NewCondition';
    // Need full url?
    const url = product.productLink;
    const priceCurrency = product.currency;

    switch (product.stockStatus) {
      case StockStatus.IN_STOCK:
        availability = 'https://schema.org/InStock';
        break;
      case StockStatus.SOLD_OUT:
        availability = 'https://schema.org/SoldOut';
        break;
      default:
        availability = 'https://schema.org/BackOrder';
        break;
    }

    const priceProps = {
      url,
      priceCurrency,
      itemCondition,
      availability,
    };

    if (product.minPrice.final_price.value !== product.maxPrice.final_price.value) {
      structuredData.offers = {
        '@type': 'AggregateOffers',
        lowPrice: product.minPrice.final_price.value,
        highPrice: product.maxPrice.final_price.value,
        ...priceProps,
      };
    } else {
      structuredData.offers = {
        '@type': 'Offer',
        price: product.price,
        ...priceProps,
      };
    }
  }

  return structuredData;
}
