import { formatCurrency } from '../../lib/cart';
import { prepareGalleryData } from '../product/model';

export function parseWishList(wishlistV2, isAccountView) {
  const productItems = [];
  const totalWishListItems = wishlistV2.items_count;
  if (!wishlistV2.items_v2) {
    return null;
  }
  wishlistV2.items_v2.items.forEach((item) => {
    const { product } = item;
    const {
      name, sku, thumbnail, uid,
    } = product;
    const minPrice = product.price_range.minimum_price;
    const { value: price, currency } = minPrice.final_price;
    const priceLabel = formatCurrency(price, currency);
    const stockStatus = product.stock_status;

    const image = thumbnail;
    const hasImage = (thumbnail && (thumbnail.disabled !== true));
    const productLink = `/${product.url_key}${product.url_suffix}`;
    const priceText = isAccountView ? priceLabel : sku;
    const crosssellProducts = product.crosssell_products;
    const productItem = {
      name,
      sku,
      image,
      hasImage,
      productLink,
      uid,
      priceText,
      stockStatus,
      crosssellProducts,
      rz_gallery_meta: product.rz_gallery_meta,
    };

    productItem.gallery = prepareGalleryData(productItem);

    productItems.push({
      product: productItem,
      id: item.id,
    });
  });

  return {
    items: productItems,
    totalWishListItems,
  };
}
