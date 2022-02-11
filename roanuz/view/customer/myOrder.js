import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { formatCurrency } from '@/roanuz/lib/cart';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Pagination } from '@/roanuz/view/product/pagination';
import {
  DisplayBold24,
} from '@/roanuz/typopgraphy';
import PageLoadingView from '@/components/utils/PageLoadingView';

const MyOrderViewWrapper = styled.div`
  >.page-section-orders {
    table {
      margin: ${asRem(15)} 0;
      width: 100%;

      th, td {
        padding: ${asRem(6)} ${asRem(6)};
        @media screen and (min-width: ${Breakpoint.md}) {
          padding: ${asRem(10)} ${asRem(10)};
        }
      }

      thead {
        th {
          text-align: left;
          font-weight: bold;
        }

        tr {
          display: none;

          @media screen and (min-width: ${Breakpoint.md}) {
            display: table-row;
            border-bottom: 2px solid var(--color-disabled);
          }
        }
      }
      tbody {
        tr {
          padding: ${asRem(10)} 0;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--color-disabled-3); 

          & :last-child {
            border-bottom: none;    
          }
          
          @media screen and (min-width: ${Breakpoint.md}) {
            display: table-row;            
          }    
          
          .status-data {
            display: flex;
            align-items: center;
          }
        }

        td {
          width: auto;

          & ::before {
            content: attr(data-th);
            display: inline-block;
            font-weight: 700;
            padding-right: ${asRem(10)};
            @media screen and (min-width: ${Breakpoint.md}) {
              display: none;
            }
          }
        }
      }
    }
    .pagination-line {
      text-align: center;
      margin: ${asRem(20)} 0;
      @media screen and (min-width: ${Breakpoint.sm}) {
        text-align: right;
      }
    }
  } 
`;

export const MyOrderView = ({
  summary,
  onPageChange,
}) => {
  const { customer } = summary;
  const currentPage = customer.orders.page_info.current_page;
  const totalPages = customer.orders.page_info.total_pages;
  const selectPage = (value) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    onPageChange(value);
  };

  return (
    <MyOrderViewWrapper>
      <DisplayBold24>Mínar pantanir</DisplayBold24>
      <div className="page-section-orders">
        {customer.orders.items.length === 0 && (
          <PageLoadingView message="Engar pantanir" />
        )}
        {customer.orders.items.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Pöntun</th>
                <th>Dagsetning</th>
                <th>Senda til</th>
                <th>Samtals</th>
                <th>Aðgerðir</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.items.map((order) => (
                <tr key={order.number}>
                  <td data-th="Pöntun #: ">
                    <Link href={`/customer/account/order/${order.number}/`}>
                      <a className="plain" alt={`Goto Pöntun ${order.number}`}>
                        {order.number}
                      </a>
                    </Link>
                  </td>
                  <td data-th="Dagsetning: ">{order.order_date ? new Date(order.order_date).toLocaleDateString() : '-'}</td>
                  <td data-th="Senda til: ">{order.shipping_address.firstname}</td>
                  <td data-th="Samtals: " className="amount">
                    {
                      formatCurrency(
                        order.total.grand_total.value,
                        order.total.grand_total.currency,
                      )
                    }
                  </td>
                  <td data-th="Aðgerðir: ">
                    <Link href={`/customer/account/order/${order.number}/`}>
                      <a className="plain" alt={`Goto Order ${order.number}`}>
                        Skoða pöntun
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="pagination-line">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChanged={(value) => selectPage(value)}
            />
          )}
        </div>
      </div>
    </MyOrderViewWrapper>
  );
};

MyOrderView.propTypes = {
  summary: PropTypes.object,
  onPageChange: PropTypes.func,
};
