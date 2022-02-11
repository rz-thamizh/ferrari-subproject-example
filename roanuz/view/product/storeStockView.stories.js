import React from 'react';
import { StoreStocksView } from './storeStockView';

export default {
  title: 'View / Product / Store Stocks Info',
  component: StoreStocksView,
};

const Template = (args) => (
  <StoreStocksView {...args} />
);

export const StoreStocks = Template.bind({});
StoreStocks.args = {
  storesList: [
    {
      name: 'Vefverslun',
      code: 'warehouse',
      yes: false,
      isAvailable: true,
    },
    {
      name: ' Akureyri',
      code: 'akureyri',
      yes: true,
      isAvailable: false,
    },
    {
      name: 'Egilsstaðir  (Í pöntun)',
      code: 'egilsstadir',
      yes: false,
      isAvailable: false,
    },
    {
      name: 'Keflavík',
      code: 'keflavik',
      yes: false,
      isAvailable: false,
    },
    {
      name: '(Test) Ryk',
      code: 'test_ryk',
      yes: false,
      isAvailable: false,
    },
  ],
  showPieceStores: [
    'Egilsstaðir',
  ],
};
