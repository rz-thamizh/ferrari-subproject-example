import React, { useEffect, useState, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { UserContext } from '@/store/core/context';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import {
  TextBold14,
  Text14,
} from '@/roanuz/typopgraphy';
import { PickupStores, PickupStoresV2 } from '@/store/cart/query';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import axios from 'axios';
import { daysContext } from '@/roanuz/view/product/deliveryPickupView';
import { RawHtmlView } from '@/roanuz/view/rawHtml';
import { getShippingCalcInput } from '@/roanuz/view/cart/model';
import Config from '@/config';
import { FormItem } from '../input';

const SelectableOptionsWrapper = styled.div`
.rz-form-select {
  margin-top: ${asRem(14)};
  max-width: ${asRem(277)};
  border-color: var(--color-button);
  div[class*="-placeholder"],
  div[class*="-singleValue"] {
    color: var(--color-button);
  }
}
>.rz-form-item {
  margin-bottom: 0 !important;
}
.pickup-store-info {
  >strong {
    padding-bottom: ${asRem(6)};
    display: block;
  }
  &:not(:empty) {
    margin-top: ${asRem(14)};
  }
}
`;

const ShippingMethodPostbox = ({ postBoxes, postBoxAttributesHandler }) => {
  return (
    <SelectableOptionsWrapper>
      <FormItem
        key="postbox"
        field={{
          isSelect: true,
          name: 'Veljið póstbox',
          id: 'postbox',
          optionsList: postBoxes,
          displayBy: 'name',
          valueBy: 'postboxId',
          accessEntireObj: true,
          onSmartChange: (value) => {
            postBoxAttributesHandler(value);
          },
        }}
      />
    </SelectableOptionsWrapper>
  );
};

ShippingMethodPostbox.propTypes = {
  postBoxes: PropTypes.array,
  postBoxAttributesHandler: PropTypes.func,
};

const ShippingMethodStorePickups = ({
  methodCode, pickUpStoreAttributesHandler, pickUpStoreAttributes,
  cart,
}) => {
  const userContext = useContext(UserContext);
  let variables = {};
  if (Config.Features.EnableDatoCMS) {
    variables = { ...getShippingCalcInput(cart) };
  } else {
    variables = { cartId: userContext.cartId };
  }
  const { loading, error, data } = useQuery(
    Config.Features.EnableDatoCMS ? PickupStoresV2 : PickupStores,
    {
      variables,
      skip: methodCode !== 'storepickup',
    },
  );

  if (loading) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);

  const { getPickupStores } = data;
  return (
    <SelectableOptionsWrapper>
      <FormItem
        key="pickupbox"
        field={{
          isSelect: true,
          name: 'Sótt í verslun',
          id: 'pickupstore',
          optionsList: getPickupStores,
          displayBy: 'name',
          valueBy: 'code',
          accessEntireObj: true,
          onSmartChange: (value) => {
            pickUpStoreAttributesHandler(value);
          },
        }}
      />
      <div className="pickup-store-info">
        {(pickUpStoreAttributes) && (pickUpStoreAttributes.pickupTimeFrom !== null)
          && (pickUpStoreAttributes.pickupTimeFrom !== undefined) && (
          <TextBold14 as="strong">
            Afgreiðslutími pantana:&nbsp;
            {daysContext(
              pickUpStoreAttributes.pickupTimeFrom,
              pickUpStoreAttributes.pickupTimeTo,
            )}
          </TextBold14>
        )}
        {pickUpStoreAttributes.pickupAddress && (
          <Text14>
            <RawHtmlView
              html={pickUpStoreAttributes.pickupAddress || ''}
            />
          </Text14>
        )}
      </div>
    </SelectableOptionsWrapper>
  );
};

ShippingMethodStorePickups.propTypes = {
  methodCode: PropTypes.string,
  pickUpStoreAttributesHandler: PropTypes.func,
  pickUpStoreAttributes: PropTypes.object,
  cart: PropTypes.object,
};

const ShippingMethodInputWrapper = styled.div`
  margin: ${asRem(20)} 0;
  padding: ${asRem(20)};
  border: ${asRem(1)} solid var(--color-disabled-3);
  border-radius: ${asRem(6)};

  &:first-child {
    margin-top: 0;
  }

  >.selection {
    display: flex;
    align-items: center;
    >div {
      min-width: ${asRem(168)};
    }
    >p {
      display: block;
    }

    .rz-form-field {
      padding-left: 0;
    }

    .rz-form-field, .rz-form-item {
      margin-bottom: 0;
    }
    .type-radio label {
      justify-content: flex-end;
      align-items: center;
      font-weight: bold;
    }
    .type-checkbox, .type-radio {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  >.help:not(:empty) {
    padding-top: ${asRem(20)};
    margin-top: ${asRem(15)};
    margin-bottom: 0;
    border-top: ${asRem(1)} solid var(--color-disabled-3);

    .rz-form-select {
      margin-top: 0;
    }

    p {
      font-size: ${asRem(14)};
      line-height: ${asRem(20)};
      >strong {
        display: block;
      }
      &+div {
        margin-top: ${asRem(14)};
      }
    }
    >strong {
      padding-bottom: ${asRem(6)};
      display: block;
    }
  }

  .row {
    .text-center {
      transform: initial !important;
    }
  }

  .sameday {
    color: var(--color-active);
  }
`;

export const ShippingMethodInput = ({
  field,
  method,
  selected,
  saving,
  pickupLocation,
  postcode,
  postBoxAttributesHandler,
  pickUpStoreAttributesHandler,
  pickUpStoreAttributes,
  cart,
}) => {
  const [recentPostCodeFetch, setRecentPostCodeFetch] = useState(postcode);
  const [postboxError, setPostboxError] = useState(null);
  const [postboxLoaded, setPostboxLoaded] = useState(false);
  const [postBoxesInfo, setPostBoxes] = useState([]);

  const fetchPostBox = () => {
    axios.get(`api/postBoxes?code=${postcode}`)
      .then(
        (result) => {
          setPostboxError(null);
          setPostboxLoaded(true);
          if (result.data.postboxes.length === 0) {
            setPostboxError({ message: 'No results available for this pincode' });
          }
          setPostBoxes(result.data.postboxes);
        },
      )
      .catch(
        (error) => {
          setPostBoxes([]); // To reset previous values (if)
          setPostboxLoaded(true);
          setPostboxError(error);
        },
      );
  };

  useEffect(() => {
    if (
      (Config.PostBoxMethodKeys.includes(method.method.code))
      && selected
      && ((recentPostCodeFetch === postcode && postBoxesInfo.length === 0)
      || (recentPostCodeFetch !== postcode))
    ) {
      fetchPostBox();
      setRecentPostCodeFetch(postcode);
    }
  }, [selected, postcode]);

  return (
    <ShippingMethodInputWrapper>
      <div className="selection">
        <FormItem
          field={field}
          disabled={saving}
        />
        <p>{method.method.title}</p>
      </div>
      {selected && (
        <>
          <div className="help">
            {method.method.code !== 'storepickup' && (
              <TextBold14 as="strong">
                Afgreiðslutími pantana:&nbsp;
                {daysContext(
                  method.method.deliveryTimeFrom,
                  method.method.deliveryTimeTo,
                )}
              </TextBold14>
            )}
            {method.method.description && (
              <Text14>
                <RawHtmlView html={method.method.description} />
              </Text14>
            )}
            {method.method.code === 'storepickup' && (
              <ShippingMethodStorePickups
                cart={cart}
                methodCode={method.method.code}
                pickUpStoreAttributesHandler={pickUpStoreAttributesHandler}
                pickUpStoreAttributes={pickUpStoreAttributes}
              />
            )}
            {Config.PostBoxMethodKeys.includes(method.method.code) && (
              <>
                {!postboxLoaded && (
                  <LoadingView />
                )}
                {postboxError && (postboxLoaded) && (
                  // <Text14>{postboxError.message || 'Error'}</Text14>
                  <ErrorView error={postboxError} />
                )}
                {postBoxesInfo && postBoxesInfo.length > 0 && (postboxLoaded) && (
                  <ShippingMethodPostbox
                    postBoxes={postBoxesInfo}
                    postBoxAttributesHandler={postBoxAttributesHandler}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </ShippingMethodInputWrapper>
  );
};

ShippingMethodInput.propTypes = {
  field: PropTypes.shape(FormItem.propTypes.field),
  method: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  saving: PropTypes.bool,
  pickupLocation: PropTypes.string,
  postcode: PropTypes.string,
  postBoxAttributesHandler: PropTypes.func,
  pickUpStoreAttributesHandler: PropTypes.func,
  pickUpStoreAttributes: PropTypes.object,
  cart: PropTypes.object,
};
