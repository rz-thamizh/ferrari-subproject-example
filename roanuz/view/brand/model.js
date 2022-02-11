import Config from '@/config';
import { Utils } from '@/lib/utils';
import { useQuery } from '@apollo/client';
import { CustomAttributeMetaData } from '@/store/brand/query';

export function createBrandKey(name) {
  if (!name) { return null; }
  const parsed = `${name}`.toLowerCase().replace(/\s/g, '-').replace(/_/g, '-');
  return encodeURIComponent(parsed);
}

export function createBrandLink(brandKey, categoryId) {
  const baseUrl = `/brand/${brandKey}/`;

  if (categoryId) {
    return `${baseUrl}category/${categoryId}`;
  }

  return baseUrl;
}

export function createBrandImageUrl(brandKey) {
  const basePath = `brand/${brandKey}.png`;
  return Utils.mergePaths([Config.AssetsPath, basePath]);
}

export function useBrandList() {
  const {
    loading,
    error,
    data,
  } = useQuery(CustomAttributeMetaData, {
    variables: { attributeCode: 'rz_manufacturer' },
  });
  let brands = null;

  if (data) {
    const items = data.customAttributeMetadata.items[0].attribute_options;
    if (items) {
      brands = items.map((raw) => {
        const key = createBrandKey(raw.label);
        return {
          key,
          id: raw.value,
          name: raw.label,
          link: createBrandLink(key),
          imageUrl: createBrandImageUrl(key),
        };
      });
    }
  }

  return {
    loading,
    error,
    brands,
  };
}
