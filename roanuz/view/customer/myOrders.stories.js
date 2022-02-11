import React from 'react';
import PropTypes from 'prop-types';
import { MyOrderView } from './myOrder';

export default {
  title: 'My Account / orders',
  component: MyOrderView,
};

const Template = ({ summary }) => <MyOrderView summary={summary} />;

export const View = Template.bind({});

View.args = {
  summary: {
    customer: {
      __typename: 'Customer',
      firstname: 'Anto',
      lastname: 'Kaspar',
      email: 'anto+r1@roanuz.com',
      orders: {
        __typename: 'CustomerOrders',
        total_count: 22,
        items: [
          {
            __typename: 'CustomerOrder',
            id: 'MTM=',
            number: '000000016',
            status: 'Processing',
            order_date: '2021-06-09 20:47:19',
            total: {
              __typename: 'OrderTotal',
              grand_total: {
                __typename: 'Money',
                value: 1303288.99,
                currency: 'ISK',
              },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'MTY=',
            number: '000000021',
            status: 'Processing',
            order_date: '2021-06-10 21:23:35',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 52.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'MTg=',
            number: '000000023',
            status: 'Processing',
            order_date: '2021-06-11 10:28:50',
            total: {
              __typename: 'OrderTotal',
              grand_total: {
                __typename: 'Money',
                value: 136000.99,
                currency: 'ISK',
              },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'MjM=',
            number: '000000028',
            status: 'Processing',
            order_date: '2021-06-11 12:35:57',
            total: {
              __typename: 'OrderTotal',
              grand_total: {
                __typename: 'Money',
                value: 136000.99,
                currency: 'ISK',
              },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja í póstbox',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'MjQ=',
            number: '000000029',
            status: 'Processing',
            order_date: '2021-06-11 15:55:54',
            total: {
              __typename: 'OrderTotal',
              grand_total: {
                __typename: 'Money',
                value: 302378.59,
                currency: 'ISK',
              },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'Njg=',
            number: '000000073',
            status: 'Pending',
            order_date: '2021-07-07 15:26:48',
            total: {
              __typename: 'OrderTotal',
              grand_total: {
                __typename: 'Money',
                value: 461756.59,
                currency: 'ISK',
              },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja í póstbox',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'ODE=',
            number: '000000086',
            status: 'Canceled',
            order_date: '2021-07-20 09:39:12',
            total: {
              __typename: 'OrderTotal',
              grand_total: {
                __typename: 'Money',
                value: 141.99,
                currency: 'ISK',
              },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'ODI=',
            number: '000000087',
            status: 'Processing',
            order_date: '2021-07-20 09:50:42',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 96.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja í póstbox',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'ODM=',
            number: '000000088',
            status: 'Pending',
            order_date: '2021-07-20 09:53:30',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 48, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'ODU=',
            number: '000000093',
            status: 'Processing',
            order_date: '2021-07-20 12:42:44',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 48, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'ODY=',
            number: '000000095',
            status: 'Processing',
            order_date: '2021-07-20 12:44:58',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 97, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'ODk=',
            number: '000000118',
            status: 'Processing',
            order_date: '2021-07-20 14:04:12',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 96.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTA=',
            number: '000000119',
            status: 'Processing',
            order_date: '2021-07-20 14:07:14',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 97, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTE=',
            number: '000000120',
            status: 'Processing',
            order_date: '2021-07-20 14:10:36',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 96.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja í póstbox',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTI=',
            number: '000000121',
            status: 'Processing',
            order_date: '2021-07-20 14:12:33',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 97, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTM=',
            number: '000000122',
            status: 'Processing',
            order_date: '2021-07-20 15:56:35',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 97, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTQ=',
            number: '000000123',
            status: 'Pending Payment',
            order_date: '2021-07-20 15:58:46',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 96.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja í póstbox',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTU=',
            number: '000000124',
            status: 'Processing',
            order_date: '2021-07-20 16:00:37',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 96.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTY=',
            number: '000000125',
            status: 'Pending Payment',
            order_date: '2021-07-20 16:08:12',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 97, currency: 'ISK' },
            },
            shipping_method: 'Flat Rate - Fixed',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
          {
            __typename: 'CustomerOrder',
            id: 'OTc=',
            number: '000000126',
            status: 'Pending Payment',
            order_date: '2021-07-20 16:11:17',
            total: {
              __typename: 'OrderTotal',
              grand_total: { __typename: 'Money', value: 96.99, currency: 'ISK' },
            },
            shipping_method: 'Roanuz Shipping Handle - Sækja á pósthús',
            shipping_address: {
              __typename: 'OrderAddress',
              firstname: 'Anto',
              lastname: 'K',
            },
          },
        ],
      },
    },
  },
};

Template.propTypes = {
  summary: PropTypes.object,
};
