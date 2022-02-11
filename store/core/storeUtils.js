import React from 'react';
import { ReactComponent as CartIcon } from '@/roanuz/view/imgs/CartIcon.svg';

import { ReactComponent as HeartIcon } from '@/roanuz/view/imgs/HeartIcon.svg';

import MissingImage from '@/roanuz/view/imgs/MissingImage.png';

import TLStore from '@/rz/view/imgs/TlStore.png';

export const StoreSpecificContent = {
  cartIcon: <CartIcon />,
  wishListIcon: <HeartIcon />,
  deafultImagePlaceholder: MissingImage,
  telephoneNumber: '414-1700',
  siteName: 'Tölvulistanum',
  contactUsPageStoreImg: TLStore,
  newsletterPageImg: TLStore,
};
