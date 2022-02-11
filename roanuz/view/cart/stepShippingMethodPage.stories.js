import React from 'react';
import { CheckoutPageLayout } from '@/roanuz/layout/checkoutPage';
import CartData from '@/stories/sample-data/cart.json';
import CartEmptyData from '@/stories/sample-data/cartEmpty.json';
import { DisplayBold30 } from '@/roanuz/typopgraphy';
import { ReactComponent as UserIcon } from '@/roanuz/view/imgs/UserIcon.svg';
import { parseCart } from './model';
import { WizardProgressView } from '../wizard';
import { Button } from '../button';
import { StepShippingMethodView } from './stepShippingMethod';
import { CartSideView } from './side';

export default {
  title: 'View / Cart / Step Shipping Page',
  component: CheckoutPageLayout,
};

const wizardItems = [
  {
    text: 'Afhending',
    href: '/checkout/step1',
    alt: 'Goto Step 1',
    future: false,
    completed: true,
  },
  {
    text: 'Yfirlit og greiðsla',
    href: '/checkout/step2',
    alt: 'Goto Step 1',
    future: false,
    completed: false,
  },
  {
    text: 'Thank You',
    href: '/checkout/step3',
    alt: 'Goto Step 3',
    future: true,
    completed: false,
  },
];

const Template = ({ cart }) => (
  <div style={{ padding: '60px 180px' }}>
    <CheckoutPageLayout
      title={(
        <DisplayBold30>Pöntunarferli</DisplayBold30>
      )}
      titleLinksLeft={(
        <WizardProgressView items={wizardItems} />
      )}
      titleLinksRight={(
        <Button
          icon={<UserIcon />}
          mode="primary"
          noborder
          nomargin
          ariaLabel="Innskráning"
        >
          Innskráning
        </Button>
      )}
      content={(
        <StepShippingMethodView cart={cart} />
      )}
      side={(
        <CartSideView cart={cart} showShipping />
      )}
    />
  </div>
);

export const NormalPage = Template.bind({});
NormalPage.args = {
  cart: parseCart(CartData.data.cart),
};

export const EmptyPage = Template.bind({});
EmptyPage.args = {
  cart: parseCart(CartEmptyData.data.cart),
};
