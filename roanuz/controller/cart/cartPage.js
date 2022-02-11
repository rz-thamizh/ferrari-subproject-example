import React from 'react';
import PropTypes from 'prop-types';
import { CartPageLayout } from '@/roanuz/layout/cartPage';
import { DisplayBold30, TextMedium16 } from '@/roanuz/typopgraphy';
import { ReactComponent as UserIcon } from '@/roanuz/view/imgs/UserIcon.svg';
import { Button } from '@/roanuz/view/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartSideView } from '@/roanuz/view/cart/side';
import { CartItemsListView } from '@/roanuz/view/cart/itemsList';
import { UserConsumer } from '@/store/core/context';

export const CartPageController = ({ cart, outOfStockError }) => {
  const router = useRouter();
  // eslint-disable-next-line no-param-reassign
  cart.shippingChargeText = null;
  return (
    <CartPageLayout
      error={(
        outOfStockError && <TextMedium16>{outOfStockError}</TextMedium16>
      )}
      title={(
        <DisplayBold30>Karfa</DisplayBold30>
      )}
      titleLinksRight={(
        <UserConsumer>
          {({ token }) => (
            token
              ? (
                <Link href="/customer/account" prefetch={false}>
                  <Button
                    icon={<UserIcon />}
                    mode="primary"
                    noborder
                    nomargin
                    ariaLabel="Mínar síður"
                  >
                    <TextMedium16>Mínar síður</TextMedium16>
                  </Button>
                </Link>
              ) : (
                <Link href={`/customer/account/login?next=${router.asPath}`} prefetch={false}>
                  <Button
                    icon={<UserIcon />}
                    mode="primary"
                    noborder
                    nomargin
                    ariaLabel="Innskráning"
                  >
                    <TextMedium16>Innskráning</TextMedium16>
                  </Button>
                </Link>
              )
          )}
        </UserConsumer>
      )}
      content={(
        <CartItemsListView
          cart={cart}
        />
      )}
      side={(
        <CartSideView
          cart={cart}
          isCartPage
        />
      )}
    />
  );
};

CartPageController.propTypes = {
  cart: PropTypes.object.isRequired,
  outOfStockError: PropTypes.string,
};
