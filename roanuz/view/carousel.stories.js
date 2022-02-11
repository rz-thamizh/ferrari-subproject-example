import React, { useState } from 'react';
import Products from '@/stories/sample-data/products.json';
import { AddToCartView } from '@/roanuz/view/product/addToCart';
import { AddToWishListView } from '@/roanuz/view/product/addToWishList';
import { ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { ProductCardView } from '@/roanuz/view/product/product';
import { parseProduct } from '@/roanuz/view/product/model';
import { CarouselView } from './carouselView';

export default {
  title: 'TL / View / Carousel View',
  component: CarouselView,
};

const AC = ({ disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const addItem = () => {
    console.log('Add item');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setData({ done: true });
    }, 1000);
  };
  return (
    <AddToCartView
      loading={loading}
      error={error}
      data={data}
      disabled={disabled}
      onClick={addItem}
    />
  );
};

const WL = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const addItem = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setData({ done: true });
    }, 1000);

    setTimeout(() => {
      setLoading(false);
      setError({ message: 'Fail to add' });
    }, 2500);
  };
  return (
    <AddToWishListView
      loading={loading}
      error={error}
      data={data}
      onClick={addItem}
    />
  );
};

const loadedProducts = Products.data.products.items;

const settings = {
  show: 5,
  arrows: true,
  dots: true,
  responsive: {
    768: {
      show: 3,
    },
    480: {
      show: 2,
    },
  },
};

const Template = () => (
  <CarouselView settings={settings}>
    {loadedProducts.map((product) => (
      <ProductCardView
        displayMode={ProductCardDisplayMode.OneBySix}
        addToCart={<AC />}
        addToWishList={<WL />}
        product={parseProduct(product)}
      />
    ))}
  </CarouselView>
);

export const ProductsCarousel = Template.bind({});
