import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  DisplayBold24, DisplayBold18, Text14,
} from '@/roanuz/typopgraphy';
import PageLoadingView from '@/components/utils/PageLoadingView';
import Link from 'next/link';
import { Button } from '../button';

const AddressViewWrapper = styled.div`
  table {
      margin-top: ${asRem(16)};
      margin-bottom: ${asRem(40)};
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
          border-bottom: 2px solid var(--color-disabled);
        }
        tr {
          display: none;
          @media screen and (min-width: ${Breakpoint.md}) {
            display: table-row;
          }
        }
      }
      tbody {
        .action-button {
          padding: 0;
          border: none;
          font-weight: 400;
          background-color: transparent;
          & :hover {
            background-color: transparent;
            color: var(--colot-text);
          }
        }
        .seperator {
          color: var(--color-grey-light);
        }
        .edit {
          color: var(--color-button);
        }
        .delete {
          color: var(--color-error);
          cursor: pointer;
        }
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
`;

const DefaultAddressWrapper = styled.div`
width: 100%;
margin-bottom: ${asRem(30)};
`;

const DefaultAddressContainerWrapper = styled.div`
  margin-top: ${asRem(16)};
  @media screen and (min-width: ${Breakpoint.md}) {
    display: flex;
    justify-content: space-between;
  }

  .container {
    width: 100%;
    max-width: ${asRem(450)};
    border: 1px solid var(--color-disabled-4);
    border-radius: ${asRem(3)};

    & :first-child {
      margin-bottom: ${asRem(20)};
    }

    @media screen and (min-width: ${Breakpoint.md}) {
      & :first-child {
        margin-right: ${asRem(20)};
        margin-bottom: 0;
      } 
    }

    .header, .main-content {
      padding: ${asRem(10)} ${asRem(15)};
      >address {
        >p {
          padding: ${asRem(3)} 0;
        }
      }
    }

    .header {
      border-bottom: 1px solid var(--color-disabled-4);
    }

    .button {
      padding-left: ${asRem(15)};
      padding-bottom: ${asRem(20)};
    }
  }
`;

const NoAddressView = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  button {
    margin-top: ${asRem(-40)};
    justify-content: center;
  }
`;

export const MyAddressView = ({ addressBookData, onDelete }) => {
  const clickHandler = (id) => {
    onDelete({ id });
  };

  // Default billing and shipping address filter
  const defaultBilling = addressBookData.customer.addresses.find((i) => {
    if (i.default_billing === true) {
      return i;
    }
    return null;
  });

  const defaultShipping = addressBookData.customer.addresses.find((i) => {
    if (i.default_shipping === true) {
      return i;
    }
    return null;
  });

  const filteredAddress = addressBookData.customer.addresses.filter((i) => {
    if (!i.default_shipping && !i.default_billing) {
      return true;
    }

    return false;
  });

  return (
    <AddressViewWrapper>
      { addressBookData.customer.addresses.length === 0 && (
        <NoAddressView>
          <PageLoadingView message="Engin heimilisföng skráð" />
          <Link href="address/new">
            <Button
              mode="primary"
              filled
              alt="Add an address"
              href={{}}
              ariaLabel="Add an address"
            >
              Bæta við heimilisfangi
            </Button>
          </Link>
        </NoAddressView>
      )}
      { addressBookData.customer.addresses.length > 0
        && (
        <>
          <DefaultAddressWrapper>
            <DisplayBold24>Heimilisföng</DisplayBold24>
            <DefaultAddressContainerWrapper>
              <div className="container">
                <div className="header">
                  <DisplayBold18>Sjálfgefið heimilisfang greiðanda</DisplayBold18>
                </div>
                {defaultShipping
                  ? (
                    <>
                      <div className="main-content">
                        <address>
                          <Text14>
                            {defaultShipping.firstname || ''}
                            {' '}
                            {defaultShipping.lastname || ''}
                          </Text14>
                          <Text14>{defaultShipping.rz_ssn || ''}</Text14>
                          <Text14>{defaultShipping.street || ''}</Text14>
                          <Text14>{defaultShipping.city || ''}</Text14>
                          <Text14><a href={`tel:${defaultShipping.telephone}`}>{defaultShipping.telephone || ''}</a></Text14>
                        </address>
                      </div>
                      <div className="button">
                        <Link href={`address/edit/${defaultShipping.id}`}>
                          <Button
                            mode="primary"
                            filled
                            alt="Change shipping address"
                            href={{}}
                            ariaLabel="Breyta heimilisfangi greiðanda"
                          >
                            Breyta heimilisfangi greiðanda
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (<PageLoadingView message="Þú ert ekki með sjálfgefið heimilisfang" />)}
              </div>
              <div className="container">
                <div className="header">
                  <DisplayBold18>Sjálfgefið heimilisfang viðtakanda</DisplayBold18>
                </div>
                {defaultBilling
                  ? (
                    <>
                      <div className="main-content">
                        <address>
                          <Text14>
                            {defaultBilling.firstname || ''}
                            {' '}
                            {defaultBilling.lastname || ''}
                          </Text14>
                          <Text14>{defaultBilling.rz_ssn || ''}</Text14>
                          <Text14>{defaultBilling.street || ''}</Text14>
                          <Text14>{defaultBilling.city || ''}</Text14>
                          <Text14><a href={`tel:${defaultBilling.telephone}`}>{defaultBilling.telephone || ''}</a></Text14>
                        </address>
                      </div>
                      <div className="button">
                        <Link href={`address/edit/${defaultBilling.id}`}>
                          <Button
                            mode="primary"
                            filled
                            alt="Change billing address"
                            href={{}}
                            ariaLabel="Breyta heimilisfangi viðtakanda"
                          >
                            Breyta heimilisfangi viðtakanda
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (<PageLoadingView message="Þú ert ekki með sjálfgefið innheimtu heimilisfang" />)}
              </div>
            </DefaultAddressContainerWrapper>
          </DefaultAddressWrapper>
          <DisplayBold24>Heimilisföng</DisplayBold24>
          <table>
            <thead>
              <tr>
                <th>Fornafn</th>
                <th>Eftirnafn</th>
                <th>Heimilisfang</th>
                <th>Staður</th>
                <th>Póstnúmer</th>
                <th>Sími</th>
                <th>Kennitala</th>
                <th>Aðgerðir</th>
              </tr>
            </thead>
            <tbody>
              {filteredAddress.map((address) => (
                <tr key={address.id}>
                  <td data-th="Fornafn: ">{address.firstname}</td>
                  <td data-th="Eftirnafn: ">{address.lastname}</td>
                  <td data-th="Heimilisfang: ">{address.street}</td>
                  <td data-th="Staður: ">{address.city}</td>
                  <td data-th="Póstnúmer: ">{address.postcode}</td>
                  <td data-th="Sími: ">{address.telephone}</td>
                  <td data-th="Kennitala: ">{address.rz_ssn || '-'}</td>
                  <td data-th="Aðgerðir: " id={address.id}>
                    <button type="button" className="action-button edit">
                      <Link href={`address/edit/${parseInt(address.id, 10)}/`}>
                        <a className="plain" alt={`Goto Pöntun ${address.id}`}>
                          Breyta
                        </a>
                      </Link>
                    </button>
                    <span className="seperator"> | </span>
                    <button type="button" id={address.id} onClick={(e) => clickHandler(parseInt(e.target.id, 10))} className="action-button delete">Eyða</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAddress.length === 0 && (<PageLoadingView message="Ekkert annað heimilisfang til staðar" />)}
          <Link href="address/new">
            <Button
              mode="primary"
              filled
              alt="Add an address"
              href={{}}
              ariaLabel="Add an address"
            >
              Bæta við heimilisfangi
            </Button>
          </Link>
        </>
        )}
    </AddressViewWrapper>
  );
};

MyAddressView.propTypes = {
  addressBookData: PropTypes.object,
  onDelete: PropTypes.func,
};
