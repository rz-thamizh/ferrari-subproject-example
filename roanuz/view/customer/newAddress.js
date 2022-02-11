import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '@/roanuz/view/button';
import {
  DisplayBold18,
  DisplayBold20,
} from '@/roanuz/typopgraphy';
import { applyMask, applySSNMask } from '../cart/model';

const NewAddressViewWrapper = styled.div`
  .container {
    @media screen and (min-width: ${Breakpoint.md}) {
      display: flex;
    }
    
    .inner-container {
      width: 100%;
      padding: 0 ${asRem(5)};
      @media screen and (min-width: ${Breakpoint.md}) {
        width: 50%;
      }

      .type-checkbox {
        padding-left: 0;
      }
    }
    .update-email {
      display: none;
    }
    .update-email-show {
      display: block;
    }
  }
  h1 {
    padding-top: ${asRem(18)};
    padding-bottom: ${asRem(18)};
    @media screen and (min-width: ${Breakpoint.sm}) {
      font-size: ${asRem(30)};
      line-height: ${asRem(37)};
    }    
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
  >.rz-page-content {
    display: block;
    padding: 0;
    .row {
      display: block;
      @media screen and (min-width: ${Breakpoint.sm}) {
        display: flex;
      }    
    }
  }
  .rz-row {
    .rz-form-item {
      flex: 1;
    }
  }
  .form-next-step {
    margin: ${asRem(18)} 0;
    .button {
      display: block;
      width: 100%;
      @media screen and (min-width: ${Breakpoint.sm}) {
        width: auto;
      }
    }
  }
`;

export const NewAddressView = ({
  onSave,
  saving,
  saveError,
  filteredAddress,
}) => {
  const fields = {
    default_shipping: {
      type: 'checkbox',
      name: 'Nota sem aðal heimilisfang',
      id: 'default_shipping',
    },
    default_billing: {
      type: 'checkbox',
      name: 'Nota sem aðal heimilisfang fyrir reikning',
      id: 'default_billing',
    },
    firstname: {
      type: 'text',
      name: 'Fornafn',
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
    ssn: {
      type: 'text',
      name: 'Kennitala',
      id: 'rz_ssn',
      validateFn: Validate.all([
        Validate.required,
        Validate.ssn,
      ]),
    },
  };

  const [formInitValue] = useState(filteredAddress ? ({
    firstname: filteredAddress.firstname || '',
    lastname: filteredAddress.lastname || '',
    company: filteredAddress.company || '',
    street: filteredAddress.street || '',
    postcode: filteredAddress.postcode || '',
    city: filteredAddress.city || '',
    telephone: filteredAddress.telephone || '',
    default_shipping: filteredAddress.default_shipping || false,
    default_billing: filteredAddress.default_billing || false,
    rz_ssn: filteredAddress.rz_ssn ? applySSNMask(filteredAddress.rz_ssn) : '',
  }) : ({
    firstname: '',
    lastname: '',
    company: '',
    street: '',
    postcode: '',
    city: '',
    telephone: '',
    default_shipping: false,
    default_billing: false,
  }));

  // Input values
  const buildSaveInput = (values) => {
    return {
      firstname: applyMask(values.firstname),
      lastname: applyMask(values.lastname),
      company: applyMask(values.company),
      street: applyMask(values.street),
      postcode: applyMask(values.postcode),
      city: applyMask(values.city),
      telephone: applyMask(values.telephone),
      default_shipping: values.default_shipping,
      default_billing: values.default_billing,
      country_code: 'IS', // Added county_code as static
      ssn: values.rz_ssn ? applySSNMask(values.rz_ssn) : '',
    };
  };

  // submit event
  const onSubmit = (values) => {
    if (onSave) {
      onSave(buildSaveInput(values));
    }
  };

  return (
    <NewAddressViewWrapper className="address-view">
      <Row className="rz-page-content">
        <Col className="page-section-main">
          <Formik
            initialValues={formInitValue}
            onSubmit={onSubmit}
            validateOnMount
          >
            {({ isValid }) => (
              <Form>
                <div className="container">
                  <div className="inner-container">
                    <DisplayBold20 as="h1">Notendaupplýsingar</DisplayBold20>
                    <div>
                      <FormItem field={fields.firstname} />
                    </div>
                    <div>
                      <FormItem field={fields.lastname} />
                    </div>
                    <div>
                      <FormItem field={fields.ssn} />
                    </div>
                    <div>
                      <FormItem field={fields.telephone} />
                    </div>
                  </div>
                  <div className="inner-container">
                    <DisplayBold20 as="h1">Heimilisfang</DisplayBold20>
                    <div>
                      <FormItem field={fields.street} />
                    </div>
                    <div>
                      <FormItem field={fields.city} />
                    </div>
                    <div>
                      <FormItem field={fields.postcode} />
                    </div>
                    <div>
                      <FormItem field={fields.default_billing} />
                    </div>
                    <div>
                      <FormItem field={fields.default_shipping} />
                    </div>
                  </div>
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
                  <Button
                    disabled={(!isValid) || saving}
                    mode="primary"
                    type="submit"
                    large
                    filled
                    className="button"
                    ariaLabel="Save address"
                  >
                    <DisplayBold18 as="span">
                      Vista heimilisfang
                    </DisplayBold18>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </NewAddressViewWrapper>
  );
};

NewAddressView.propTypes = {
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  filteredAddress: PropTypes.object,
};
