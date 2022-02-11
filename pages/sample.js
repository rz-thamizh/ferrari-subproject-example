import React, { useState } from 'react';
import Config from '@/config';

import { StoreConfigConsumer } from '@/store/core/context';
import { AddToCartView } from '@/roanuz/view/product/addToCart';
import { AddToWishListView } from '@/roanuz/view/product/addToWishList';
import { ButtonList } from '@/roanuz/view/button';
import styled from 'styled-components';

export const Normal = () => (
  <ButtonList>
    <AddToCartView
      loading={false}
      error={null}
      data={null}
    />
    <AddToWishListView
      loading={false}
      error={null}
      data={null}
    />
  </ButtonList>
);

export const Loading = () => (
  <ButtonList>
    <AddToCartView
      loading
      error={null}
      data={null}
    />
    <AddToWishListView
      loading
      error={null}
      data={null}
    />
  </ButtonList>
);

export const Error = () => (
  <ButtonList>
    <AddToCartView
      loading={false}
      error={{ message: 'Something wrong!' }}
      data={null}
    />
    <AddToWishListView
      loading={false}
      error={{ message: 'Something wrong!' }}
      data={null}
    />
  </ButtonList>
);

export const Done = () => (
  <ButtonList>
    <AddToCartView
      loading={false}
      error={null}
      data={{ good: true }}
    />
    <AddToWishListView
      loading={false}
      error={null}
      data={{ good: true }}
    />
  </ButtonList>
);

export const Disabled = () => (
  <ButtonList>
    <AddToCartView
      loading={false}
      error={null}
      data={null}
      disabled
    />
    <AddToWishListView
      loading={false}
      error={null}
      data={null}
      disabled
    />
  </ButtonList>
);

export const Added = () => (
  <ButtonList>
    <AddToWishListView
      loading={false}
      error={null}
      data={null}
      filledIconRed
    />
  </ButtonList>
);

export const CartStateChange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const doIt = () => {
    setData(null);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setData({ good: true });
      setError(null);
      setLoading(false);
    }, 3500);

    setTimeout(() => {
      // setData(null);
      // setError({ message: 'Failed' });
      // setLoading(false);
      setData(null);
      setError(null);
      setLoading(false);
    }, 5500);
  };

  return (
    <div
      onClick={doIt}
      onKeyPress={() => doIt()}
      role="button"
      tabIndex="0"
    >
      <ButtonList>
        <AddToCartView
          loading={loading}
          error={error}
          data={data}
        />
        <AddToWishListView
          loading={loading}
          error={error}
          data={data}
        />
      </ButtonList>
    </div>
  );
};

const AllWrapper = styled.div`
  > div {
    padding: 10px;
    border-bottom: 1px solid;
  }
`;

export const SamplePage = () => {
  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <main>
            <AllWrapper>
              <div>
                <CartStateChange />
              </div>
              <div>
                {Done()}
              </div>
              <div>
                {Loading()}
              </div>
              <div>
                {Error()}
              </div>
              <div>
                {Normal()}
              </div>
              <div>
                {Added()}
              </div>
              <div>
                {Disabled()}
              </div>
            </AllWrapper>
          </main>
        </div>
      )}
    </StoreConfigConsumer>
  );
};

export async function getStaticProps() {
  // console.log('Dynamic Page Props', Config.PageCacheSeconds);
  return { props: {}, revalidate: Config.PageCacheSeconds };
}

SamplePage.propTypes = {
};

export default SamplePage;
