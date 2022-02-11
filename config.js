export const Websites = {
  ROANUZ: 'rz',
};

function parseBool(val, defaultValue) {
  if (val === true) return true;

  const parsed = `${val}`.toLowerCase();
  if (parsed === '1' || parsed === 'true') {
    return true;
  }

  if (defaultValue === undefined) {
    return false;
  }

  return defaultValue;
}

function parseList(val, defaultValue) {
  const defaultVal = defaultValue || [];
  if (!val) return defaultVal;

  return val.split(';').map((x) => x.trim());
}

const Config = {
  SystemPath: process.env.NEXT_PUBLIC_RZ_SYS_PATH,
  BackendPath: process.env.NEXT_PUBLIC_RZ_BACKEND_PATH,
  PrivateBackendPath: process.env.RZ_PRIVATE_BACKEND_PATH,
  BackendThemeId: process.env.NEXT_PUBLIC_RZ_BACKEND_THEME_ID || null,
  LoginPath: process.env.NEXT_PUBLIC_RZ_LOGIN_PATH || '/customer/account/login',
  RegisterPath: process.env.NEXT_PUBLIC_RZ_LOGIN_PATH || '/customer/account/register',
  Locale: process.env.NEXT_PUBLIC_RZ_LOCALE || 'is-IS',
  PreferUserLocal: process.env.NEXT_PUBLIC_RZ_PREFER_USER_LOCALE || 0,
  Currency: process.env.NEXT_PUBLIC_RZ_CURRENCY || 'ISK',
  CurrencySymbol: process.env.NEXT_PUBLIC_RZ_CURRENCY || 'kr',
  ShopStockAttributePrefix: process.env.NEXT_PUBLIC_RZ_ShopStockAttributePrefix || 'rz_stock_shop',
  AlgoliaAppKey: process.env.NEXT_PUBLIC_RZ_ALGOLIA_APP,
  AlgoliaSearchKey: process.env.NEXT_PUBLIC_RZ_ALGOLIA_KEY,
  AlgoliaPrefetchSearch: parseInt(process.env.NEXT_PUBLIC_RZ_ALGOLIA_PREFETCH_SEARCH || 0, 10),
  WishListPageSize: parseInt(process.env.NEXT_PUBLIC_RZ_WISHLIST_PAGE_SIZE || 20, 10),
  MinAmountForLoan: parseInt(process.env.NEXT_PUBLIC_RZ_MIN_AMOUNT_FOR_LOAN || 10000, 10),
  WebsiteKey: process.env.NEXT_PUBLIC_RZ_WEBSITE_KEY || Websites.ROANUZ,
  IsProd: process.env.NODE_ENV === 'production',
  PageCacheSeconds: parseInt(process.env.RZ_PAGE_CACHE_SECONDS || 30, 10),
  HomePageCacheSeconds: parseInt(process.env.RZ_HOME_PAGE_CACHE_SECONDS || 5, 10),
  PublicURL: process.env.NEXT_PUBLIC_RZ_PUBLIC_URL || null,
  SiteId: process.env.NEXT_PUBLIC_RZ_SITE_ID || null,
  StoreViewCode: process.env.NEXT_PUBLIC_RZ_STORE_VIEW_CODE || 'default',
  EnergyLabelAttribute: process.env.NEXT_PUBLIC_RZ_ENERGY_LABEL_ATTRIBUTE || 'rz_energy_label',
  AssetsPath: process.env.NEXT_PUBLIC_RZ_ASSETS_PATH || '/',
  ProductImagePath: process.env.NEXT_PUBLIC_RZ_PRODUCT_IMAGE_PATH || '/',
  ProductImageSmallSize: process.env.NEXT_PUBLIC_RZ_PRODUCT_IMAGE_SMALL_SIZE || 'small',
  PreConnectUrls: parseList(process.env.NEXT_PUBLIC_RZ_PRECONNECT_URLS),
  BrandCmsPagePattern: process.env.NEXT_PUBLIC_RZ_BRAND_CMS_PAGE_PATTERN || 'brand-$0',
  AlgoliaIndexNamePrefix: process.env.NEXT_PUBLIC_RZ_ALGOLIA_INDEX_NAME_PREFIX || 'magento2_default_',
  MappanApiPath: process.env.NEXT_PUBLIC_RZ_MAPPIN_API_PATH,
  ShowPercentageForDiscountUnder:
    parseInt(process.env.NEXT_PUBLIC_RZ_SHOW_PERCENTAGE_FOR_DISCOUNT_UNDER || 10000, 10),
  GoogleMapApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  GoogleMapLocationLatitudePoint: Number(process.env.NEXT_PUBLIC_GOOGLE_MAP_LAT_POINT),
  GoogleMapLocationLongitudePoint: Number(process.env.NEXT_PUBLIC_GOOGLE_MAP_LONG_POINT),
  EnableSEO: parseBool(process.env.NEXT_PUBLIC_ENABLE_SEO, false),
  DefaultCountryPhoneCode: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_PHONE_CODE || '+354',

  GTM: process.env.NEXT_PUBLIC_RZ_GTM || 'GTM-NQ4PD75',
  CookieConsentLink: process.env.NEXT_PUBLIC_RZ_COOKIE_CONSENT_LINK || '/vafrakokur',
  CookieConsentVersion: process.env.NEXT_PUBLIC_RZ_COOKIE_CONSENT_VERSION || '1.0.0',
  CookieConsentDenyExpireSeconds: parseInt(
    process.env.NEXT_PUBLIC_RZ_COOKIE_CONSENT_DENY_EXPIRE || (24 * 60 * 60),
    10,
  ),
  DefaultShippingTaxLabel: process.env.NEXT_PUBLIC_RZ_DEFAULT_SHIPPING_TAX_LABEL || 'IS-Shipping-A',
  ProductReturndays: parseInt(process.env.NEXT_PUBLIC_RZ_PRODUCT_RETURN_DAYS || 14, 10),
  translation: {
    'IS-Class-A': 'VSK af vörum (24%)',
    'IS-Shipping-A': 'VSK af sendingu (24%)',
    Price: 'Verð',
    Category: 'Vöruflokkur',
  },
  cart: {
    paymentMethods: {
      checkmo: { title: 'Millifærsla' },
      netgiro: { title: 'Netgíró' },
      borgun_gateway: { title: 'Greiða með debit/kredit korti' },
      siminn_api: { title: 'Síminn Pay' },
      // banktransfer: { title: 'Setja í reikning' },
      purchaseorder: { title: 'Setja í reikning' },
    },
  },
  EnquiryFormRecipientsEmail: process.env.NEXT_PUBLIC_RZ_ENQUIRY_FORM_RECIPIENTS_EMAIL || 'ram@roanuz.com',
  categoryFilter: {
    showOnlyChildLevel: true,
    closeDefaults: false,
    closePrice: false,
    closeFilters: true,

    // true for asc and false for desc
    defaultSortDirection: {
      rz_rank: false,
    },

    defaultSortBy: process.env.NEXT_PUBLIC_RZ_CATEGORY_FILTER_DEFAULT_SORT_BY || null,

    sortOptions: {
      // fieldName: {
      //   disabled: true,
      //   label: 'Name',
      //   suffix: 'x',
      // },
      position: { disabled: true },
      positionDesc: { disabled: true },

      name: { label: 'Nafni' },
      nameDesc: { disabled: true },

      new: { label: 'Nýjast' },
      newDesc: { disabled: true },

      price: { label: 'Lægsta verð' },
      priceDesc: { label: 'Hæsta verð' },

      rz_rank: { disabled: true },
      rz_rankDesc: { suffix: '', disabled: true },

      relevance: { label: 'Sjálfgefið', id: 'relevance' },
      relevanceDesc: { suffix: '', disabled: true },

    },

    enableRelevanceSortItem: true,
  },
  EnableClientSideRefresh: parseBool(process.env.NEXT_PUBLIC_ENABLE_CLIENT_SIDE_REFRESH, false),
  RestrictedPaymentMethods: ['purchaseorder'],
  UseImagePathForSuggestion:
    parseBool(process.env.NEXT_PUBLIC_USE_IMAGE_PATH_FOR_SUGGESTION, false),
  ShowCatgoriesListOnHome:
    parseBool(process.env.NEXT_PUBLIC_SHOW_CATEGORIES_LIST_ON_HOME, false),
  MerchantIdNumber: process.env.NEXT_PUBLIC_MERCHANT_ID_NUMBER || '501203-2620',
  MerchantAccountNumber: process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT_NUMBER || '0526-26-501220',
  SitePaths: {
    TL: 'https://tl.is/',
    HT: 'https://ht.is/',
    KG: 'https://kunigund.is/',
  },
  RestrictProductByWebsite: parseBool(process.env.NEXT_PUBLIC_RESTRICT_PRODUCT_BY_WEBSITE, false),
  PostBoxMethodKeys: ['saekjapostbox', 'B2B_saekjapostbox'],

  ReplaceMediaUrl: parseList(process.env.NEXT_PUBLIC_RZ_REPLACE_MEDIA_URL),
  EnablePiceSlider: parseBool(process.env.NEXT_PUBLIC_ENABLE_PRICE_RANGE_SLIDER, false),

  Features: {
    EnableDatoCMS: parseBool(process.env.NEXT_PUBLIC_ENABLE_DATO_CMS, false),
  },
  // In algolia dashboard, enable the Attributes for faceting for specific index (products)
  // and enable below config.
  FilterAlgoliaBasedOnWebsite: parseBool(process.env.NEXT_PUBLIC_FILTER_ALGOLIA_BY_WEBSITE, false),
};

export default Config;
