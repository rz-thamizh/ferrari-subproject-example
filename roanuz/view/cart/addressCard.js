import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Bold16, Text16 } from '@/roanuz/typopgraphy';
import { FormItem } from '../input';

const AdddressCardViewWrapper = styled.div.attrs(() => ({
  className: 'rz-address-card',
}))`
  > .name {
    font-weight: bold;
  }
  b {
    padding-bottom: ${asRem(6)};
    display: block;
  }
  p {
    padding-bottom: ${asRem(6)};
    &:last-child {
      padding-bottom: ${asRem(0)};
    }
  }
  ${({ radio }) => radio && `
    padding: ${asRem(10)};
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding: ${asRem(20)};
    }
    border: ${asRem(1)} solid var(--color-button);
    border-radius: ${asRem(6)};

    >.selection {
      >p {
        display: block;
      }

      .rz-form-field {
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
      }

      .rz-form-field, .rz-form-item {
        margin-bottom: 0;
        margin-right: 0;
      }
      .rz-form-field {
        .input {
          label {
            flex-direction: row;
            justify-content: space-between;
            span {
              padding-left: 0;
              padding-right: ${asRem(10)}
            }
          }
        }
      }
      .type-radio label{
        justify-content: left;
        align-items: center;
        font-weight: bold;
      }
    }
  `}
`;

export const AdddressCardView = ({
  address, selectFormField,
}) => {
  return (
    <AdddressCardViewWrapper radio={selectFormField}>
      <div className="selection">
        {selectFormField && (
          <FormItem
            field={selectFormField}
          />
        )}
        <address>
          {!selectFormField && address.firstname && (
            <Bold16>
              {address.firstname}
              {' '}
              {address.lastname && address.lastname !== '-' && address.lastname}
            </Bold16>
          )}
          {address.telephone && (
            <Text16>
              Sími:&nbsp;
              <a href={`tel:${address.telephone}`}>{address.telephone}</a>
            </Text16>
          )}
          {address.email && (
            <Text16>
              Netfang:&nbsp;
              <a href={`mailto:${address.email}`}>{address.email}</a>
            </Text16>
          )}
          {address.rz_ssn && (
            <Text16>
              Kennitala:&nbsp;
              {address.rz_ssn}
            </Text16>
          )}
          {address.street && (
            <Text16>
              {address.street}
              ,&nbsp;
              {address.city}
              ,&nbsp;
              {address.postcode}
            </Text16>
          )}
        </address>
      </div>
    </AdddressCardViewWrapper>
  );
};

AdddressCardView.propTypes = {
  selectFormField: PropTypes.shape(FormItem.propTypes.field),
  address: PropTypes.object,
};
