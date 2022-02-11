import { ProductSpecQuery } from '@/store/product/product.graphql';
import { useQuery } from '@apollo/client';

export function ProductSpecController(productSku) {
  const { error, data } = useQuery(ProductSpecQuery, { variables: { sku: productSku } });

  if (error) {
    return { error };
  }
  if (data && data.rzProductSpecification && data.rzProductSpecification.attributeList.length) {
    return data.rzProductSpecification.attributeList;
  }
  return null;
}
