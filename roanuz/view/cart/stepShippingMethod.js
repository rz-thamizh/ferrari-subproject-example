import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import { DisplayMedium20, Text16 } from '@/roanuz/typopgraphy';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import Validate from '@/roanuz/lib/validate';
import { Row } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ReactComponent as AddAddress } from '@/roanuz/view/imgs/AddAddress.svg';
import { FormItem } from '../input';
import { Button } from '../button';
import { AdddressCardView } from './addressCard';
import { ShippingMethodInput } from './shippingMethod';
import {
  applyMask, replaceMask, extracMethodValue, applySSNMask,
} from './model';
import { SVGIcon } from '../icon';

const StepShippingMethodViewWrapper = styled(FormWrapperStyle)`
  h4 {
    padding-top: ${asRem(15)};
    padding-bottom: ${asRem(16)};
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding-top: ${asRem(38)};
      padding-bottom: ${asRem(18)};
    }
  }

  .first-section {
    h4 {
      &:first-child {
        padding-top: 0;
      }
    }
  }

  .rz-row {
    .rz-form-item {
      flex: 1;
    }
    .rz-form-field {
      margin-bottom: 0;
      ~ .error-message {
        margin-top: ${asRem(8)};
      }
    }
    flex-direction: column;
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: row;
    }
  }

  .rz-form-item {
    margin-bottom: ${asRem(16)};
  }

  .form-shipping-items {
    .shipping-help-text {
      padding-bottom: ${asRem(16)};
    }

    p.error {
      color: var(--color-focus);
      // padding-bottom: ${asRem(18)};
    }
  }

  .form-next-step {
    border-top: 1px solid var(--color-grey-light);
    padding-top: ${asRem(20)};
    margin-top: ${asRem(38)};
    text-align: right;

    .terms-container {
      display: flex;
      align-items: center;
      margin-bottom: ${asRem(20)};
      
      >.rz-form-item {
        margin: 0;

        >.rz-form-field {
          padding: 0;
          margin: 0;
        }
      }
    }
  }

  .item-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: ${asRem(10)};
    >button {
      padding-left: 0;
      padding-right: 0;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      path {
        stroke: var(--color-button);
      }
    }
  }

  .item-address-selection {
    display: flex;
    flex-wrap: wrap;

    >.selection-box {
      width: 100%;
      >div {
        margin: ${asRem(10)} 0;
      }
      @media screen and (min-width: ${Breakpoint.md}) {
        width: 50%;
        >div {
          margin: ${asRem(10)};
        }
        &:nth-child(even)>div {
          margin-right: 0;
        }
        &:nth-child(odd)>div {
          margin-left: 0;
        }
      }
    }
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    .sibling-fields {
      >div:first-child {
        margin-right: ${asRem(10)};
      }
    }
  }
`;

export const StepShippingMethodView = ({
  cart,
  onShippingReqChange,
  onReqSave,
  saving,
  saveError,
  showAddressSelection,
  addresses,
  onNewAddressSelect,
  postBoxAttributesHandler,
  pickUpStoreAttributesHandler,
  postBoxAttributes,
  pickUpStoreAttributes,
  userDetails,
  isGuestUser,
}) => {
  const fields = {
    email: {
      type: 'email',
      name: 'Netfang',
      id: 'email',
      validateFn: Validate.all([
        Validate.required,
        Validate.email,
      ]),
    },
    ssn: {
      type: 'text',
      name: 'Kennitala',
      id: 'rz_ssn',
      validateFn: Validate.all([
        Validate.required,
        Validate.ssn,
      ]),
    },
    firstname: {
      type: 'text',
      name: isGuestUser ? 'Fullt nafn' : 'Fornafn',
      id: 'firstname',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(3, 50),
      ]),
    },
    lastname: {
      type: 'text',
      name: 'Eftirnafn',
      id: 'lastname',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(1, 50),
      ]),
    },
    street: {
      type: 'text',
      name: 'Heimilisfang',
      id: 'street',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(null, 120),
      ]),
    },
    postcode: {
      isSelect: true,
      name: 'Póstnúmer',
      id: 'postcode',
      validateFn: Validate.all([
        Validate.required,
        // Validate.minMax(100, 1000),
      ]),
    },
    city: {
      type: 'text',
      name: 'Staður',
      id: 'city',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(null, 120),
      ]),
    },
    telephone: {
      type: 'text',
      name: 'Farsími fyrir SMS tilkynningu',
      id: 'telephone',
      validateFn: Validate.all([
        Validate.required,
        Validate.telephone,
        // Validate.lengthMinMax(11, 11, { message: 'Vinsamlegast sláið inn löglegt símanúmer' }),
      ]),
    },
    termsAndConditions: {
      type: 'checkbox',
      name: '',
      id: 'termsAndConditions',
      validateFn: Validate.all([
        Validate.required,
      ]),
    },
  };

  const shippingAddress = cart.shippingAddress || {};
  const shippingMethod = cart.shippingMethod || {};

  let street = '';
  if (shippingAddress.street) {
    [street] = shippingAddress.street;
  }

  const formatfName = (values) => {
    const isSame = values.firstname === values.lastname;
    const fullName = isSame ? values.firstname : `${values.firstname} ${values.lastname}`;
    return fullName ? applyMask(fullName) : '';
  };

  // Valid SSN for testing purpose - 120174-3399, 111-111-111-9s, 1111111119
  const [formInitVal] = useState({
    email: cart.email || '',
    rz_ssn: shippingAddress.rz_ssn ? applySSNMask(shippingAddress.rz_ssn) : '',
    firstname: isGuestUser ? formatfName(shippingAddress) : replaceMask(shippingAddress.firstname || ''),
    lastname: replaceMask(shippingAddress.lastname || ''),
    company: shippingAddress.company || '',
    street: replaceMask(street || ''),
    postcode: shippingAddress.postcode || '',
    city: replaceMask(shippingAddress.city || ''),
    telephone: replaceMask(shippingAddress.telephone || ''),
    shippingMethod: shippingMethod.value || '',
    pickupLocation: shippingAddress.pickup_location_code || '',
    addressId: shippingAddress.rz_uid || cart.defaultAddressId || '',
    customerAddressId: (shippingAddress.rz_uid && shippingAddress.rz_uid.toString()) || '',
    postbox: postBoxAttributes && postBoxAttributes.postboxName && postBoxAttributes.postboxId ? {
      name: postBoxAttributes.postboxName,
      postboxId: postBoxAttributes.postboxId,
      address: postBoxAttributes.postboxAddress,
      latitude: postBoxAttributes.postboxLatitude,
      longitude: postBoxAttributes.postboxLongitude,
    } : null,
    pickupstore: pickUpStoreAttributes && pickUpStoreAttributes.pickupStore
      && pickUpStoreAttributes.pickupStoreCode ? {
        name: pickUpStoreAttributes.pickupStore,
        code: pickUpStoreAttributes.pickupStoreCode,
        description: pickUpStoreAttributes.pickupAddress,
        pickup_time_from: pickUpStoreAttributes.pickupTimeFrom,
        pickup_time_to: pickUpStoreAttributes.pickupTimeTo,
      } : null,
  });

  useEffect(() => {
    if (!Object.keys(shippingAddress).length && userDetails && userDetails.customer) {
      formInitVal.firstname = userDetails.customer.firstname;
      formInitVal.lastname = userDetails.customer.lastname;
      formInitVal.rz_ssn = userDetails.customer.ssn ? applySSNMask(userDetails.customer.ssn) : '';
    }
  }, [userDetails]);

  // Why not 🤷‍♀️ - a nice little suprise on autofill.
  // const autoFillCity = (codeValue, values, setFieldValue) => {
  //   if (!values.city) {
  //     const code = Validate.parseNumber(codeValue);
  //     if (code > 100 && code < 170) {
  //       setFieldValue('city', 'Reykjavík');
  //     }
  //   }
  // };

  const buildAddressSaveInput = (values) => {
    const address = {
      firstname: applyMask(values.firstname),
      lastname: applyMask(values.lastname),
      company: values.company,
      street: [applyMask(values.street)],
      postcode: values.postcode,
      city: applyMask(values.city),
      telephone: applyMask(values.telephone),
      country_code: 'IS',
    };

    if (isGuestUser) {
      const [fname, lname] = values.firstname.split(/\s+(.*)/);
      address.firstname = applyMask(fname);
      address.lastname = lname ? applyMask(lname) : applyMask(fname);
    }

    let shippingAddresses = [{
      customer_address_id: values.customerAddressId ? parseInt(values.customerAddressId, 10) : null,
      pickup_location_code: values.pickupLocation || null,
    }];
    if (!values.customerAddressId && !showAddressSelection) {
      shippingAddresses = [{
        address,
        // customer_address_id: values.customerAddressId || null,
        pickup_location_code: values.pickupLocation || null,
      }];
    }
    return {
      cart_id: cart.id,
      ssn: values.rz_ssn ? applySSNMask(values.rz_ssn) : null,
      shipping_addresses: shippingAddresses,
    };
  };

  const buildBillingSaveInput = (values) => {
    const address = {
      cart_id: cart.id,
      billing_address: {
        customer_address_id: values.customerAddressId
          ? parseInt(values.customerAddressId, 10)
          : null,
      },
    };

    if (values.customerAddressId) {
      address.billing_address.customer_address_id = parseInt(values.customerAddressId, 10);
      address.billing_address.same_as_shipping = true;
    } else {
      address.billing_address.address = buildAddressSaveInput(values).shipping_addresses[0].address;
    }
    if (address.billing_address.address) {
      address.billing_address.address.save_in_address_book = false;
    }
    return address;
  };

  const buildMethodSaveInput = (values) => {
    const selectedMethod = values.shippingMethod;
    return {
      cart_id: cart.id,
      shipping_methods: [extracMethodValue(selectedMethod)],
    };
  };

  const buildEmailSaveInput = (values) => {
    return {
      cart_id: cart.id,
      email: values.email,
    };
  };

  const buildSaveInput = (values) => {
    return {
      shippingAddres: buildAddressSaveInput(values),
      billingAddres: buildBillingSaveInput(values),
      shippingMethod: buildMethodSaveInput(values),
      email: buildEmailSaveInput(values),
    };
  };

  useEffect(() => {
    console.log('Alreday shipping methiod is there - RE-VALIDATION NEEDED');
  }, [cart.shippingMethod]);

  const onPincodeChange = (newCode, values) => {
    if (fields.postcode.validateFn(newCode)) return;

    console.log('New Pincode', newCode, values.postcode);
    // autoFillCity(newCode, setFieldValue);
    console.log(values.postcode, values.city, values.street);
    if (onShippingReqChange) {
      onShippingReqChange(buildAddressSaveInput(values));
    }
  };

  const fromAddressBook = (address, values, setFieldValue) => {
    setFieldValue('postcode', address.postcode);
    /* eslint no-param-reassign: ["error", { "props": false }] */
    values.customerAddressId = address.id;
    onPincodeChange(address.postcode, values);
  };

  const onSubmit = (values) => {
    if (onReqSave) {
      onReqSave(buildSaveInput(values));
    }
  };

  const scrollViewTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const switchToAddNewAddress = (values) => {
    // Added the just below line for::
    // Lets say, we selected an address from the book and even then going back to the
    // add new address section, the upadted values not getting saved, since alreday the
    // selected customer address id exixts. so making it off here
    values.customerAddressId = null;
    if (onNewAddressSelect) {
      onNewAddressSelect();
    }
  };

  const ifIsAddressSelected = (values) => {
    if (showAddressSelection) {
      if (!values.customerAddressId) {
        return true;
      }
      return false;
    }
    return false;
  };

  const isExtAttribute = (values) => {
    const methodCode = extracMethodValue(values.shippingMethod).method_code;
    switch (methodCode) {
      case 'storepickup':
        if (!pickUpStoreAttributes.pickupStoreCode && !pickUpStoreAttributes.pickupStore) {
          return false;
        }
        break;
      case 'saekjapostbox':
      case 'B2B_saekjapostbox':
        if (Object.values(postBoxAttributes).includes(null)
          || Object.values(postBoxAttributes).includes('')) {
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  return (
    <StepShippingMethodViewWrapper>
      <Formik
        initialValues={formInitVal}
        onSubmit={onSubmit}
        validateOnMount
      >
        {({
          values, errors, isValid, setFieldValue, touched,
        }) => (
          <Form>
            {showAddressSelection
              ? (
                <div className="form-address-items first-section">
                  <div className="item-title-bar">
                    <DisplayMedium20 as="span">Móttakandi</DisplayMedium20>
                    <Button
                      onClick={() => switchToAddNewAddress(values)}
                      mode="primary"
                      noborder
                      ariaLabel="Bæta við heimilisfangi"
                    >
                      <SVGIcon
                        heightPx={20}
                      >
                        <AddAddress />
                      </SVGIcon>
                      Bæta við heimilisfangi
                    </Button>
                  </div>
                  <div className="item-address-selection">
                    {addresses ? addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`selection-box ${address.rz_uid === formInitVal.rz_uid ? 'active' : ''}`}
                      >
                        <AdddressCardView
                          address={address}
                          selectFormField={{
                            type: 'radio',
                            name: `${address.firstname} ${address.lastname}`,
                            id: 'customerAddressId',
                            value: address.id.toString(),
                            onChange: () => {
                              fromAddressBook(address, values, setFieldValue);
                            },
                          }}
                        />
                        {/* <div className="selecion-input">
                          <FormItem
                            field={{
                              type: 'radio', name: '', id: 'addressId', value: address.rz_uid,
                            }}
                          />
                        </div> */}
                      </div>
                    )) : null}
                  </div>
                </div>
              )
              : (
                <div className="form-address-items first-section">
                  <DisplayMedium20>Persónuupplýsingar</DisplayMedium20>
                  <div>
                    <FormItem
                      field={fields.email}
                      showInitialError={(formInitVal.email
                        && !touched.email) && errors.email}
                    />
                  </div>
                  <div>
                    <FormItem
                      field={fields.ssn}
                      showInitialError={(formInitVal.ssn
                        && !touched.ssn) && errors.ssn}
                    />
                  </div>
                  {!isGuestUser ? (
                    <Row className="sibling-fields">
                      <FormItem field={fields.firstname} />
                      <FormItem field={fields.lastname} />
                    </Row>
                  ) : (
                    <div>
                      <FormItem field={fields.firstname} />
                    </div>
                  )}
                  {/* <TextMedium14>
                    Þú getur stofnað aðgang í lok pöntunarferilsins
                  </TextMedium14> */}
                  <DisplayMedium20>Afhending</DisplayMedium20>
                  {/* <div>
                    <FormItem field={fields.company} />
                  </div> */}
                  <div>
                    <FormItem field={fields.street} />
                  </div>
                  <Row className="sibling-fields">
                    <FormItem field={{
                      ...fields.postcode,
                      onSmartChange: (value) => {
                        onPincodeChange(value, values);
                      },
                    }}
                    />
                    <FormItem field={fields.city} />
                  </Row>
                  <div>
                    <FormItem
                      field={fields.telephone}
                      showInitialError={(formInitVal.telephone
                        && !touched.telephone) && errors.telephone}
                    />
                  </div>
                </div>
              )}
            <div className="form-shipping-items">
              <DisplayMedium20>Sendingarmáti</DisplayMedium20>
              {((!values.postcode || errors.postcode)
                ? (
                  <p className="error">Sláðu inn póstnúmer til að sjá mögulega sendingarmáta</p>
                )
                : (
                  <div>
                    {saving && (
                      <div>Uppfæri afhendingarmáta</div>
                    )}
                    {cart.availableShippingMethods.map((method) => (
                      <ShippingMethodInput
                        key={method.method.uid}
                        field={{
                          type: 'radio',
                          id: 'shippingMethod',
                          name: method.priceText,
                          value: method.method.value,
                        }}
                        cart={cart}
                        method={method}
                        saving={saving}
                        selected={method.method.value === values.shippingMethod}
                        pickupLocation={formInitVal.pickupLocation}
                        postcode={values.postcode}
                        postBoxAttributesHandler={postBoxAttributesHandler}
                        pickUpStoreAttributesHandler={pickUpStoreAttributesHandler}
                        pickUpStoreAttributes={pickUpStoreAttributes}
                      />
                    ))}
                  </div>
                )
              )}
            </div>
            <div>
              {saveError && (
                <div>
                  Villa:
                  {saveError.message}
                </div>
              )}
            </div>
            <div className="form-next-step">
              {isGuestUser && (
                <div className="terms-container">
                  <FormItem field={fields.termsAndConditions} />
                  <a href="/vidskiptaskilmalar" target="_blank" rel="noreferrer">
                    Samþykkja viðskiptaskilmála
                  </a>
                </div>
              )}
              <Button
                disabled={
                  (!isValid) || saving || !values.shippingMethod || !isExtAttribute(values)
                  || ifIsAddressSelected(values)
                }
                mode="primary"
                type="submit"
                large
                filled
                onClick={() => scrollViewTop()}
                ariaLabel="Næsta skref"
              >
                Næsta skref
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </StepShippingMethodViewWrapper>
  );
};

StepShippingMethodView.propTypes = {
  cart: PropTypes.object.isRequired,
  onShippingReqChange: PropTypes.func,
  onReqSave: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  showAddressSelection: PropTypes.bool,
  onNewAddressSelect: PropTypes.func,
  addresses: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.bool,
  ]),
  postBoxAttributesHandler: PropTypes.func,
  pickUpStoreAttributesHandler: PropTypes.func,
  postBoxAttributes: PropTypes.object,
  pickUpStoreAttributes: PropTypes.object,
  userDetails: PropTypes.object,
  isGuestUser: PropTypes.bool,
};
