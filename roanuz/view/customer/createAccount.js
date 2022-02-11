import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '@/roanuz/view/button';
import {
  DisplayBold18,
  DisplayBold20,
  TextBold14,
} from '@/roanuz/typopgraphy';
import Link from 'next/link';
import { applySSNMask } from '../cart/model';

const CreateAccountViewWrapper = styled.div`
  margin: auto;
  @media screen and (min-width: ${Breakpoint.sm}) {
    max-width: ${asRem(704)};
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

  >.rz-page-content-inner {
    padding-top: ${asRem(30)};
    display: block;
  }


  .rz-row {
    flex-direction: column;
    .rz-form-item {
      flex: 1;
      margin-bottom: ${asRem(16)};
    }
    .rz-form-field {
      margin-bottom: 0;
    }

    .type-checkbox {
      padding-left: 0;

      .input {
        label {
          align-items: center;
        }
      }
    }
  }

  .newsletter {
    label {
      justify-content: left;
    }
  }

  .terms-container {
    display: flex;
    align-items: center;
        
    >.rz-form-item {
      margin: 0;
      max-width: max-content;

      >.rz-form-field {
        padding: 0;
      }
    }
  }

  .form-next-step {
    margin: ${asRem(26)} 0;

    .button {
      display: block;
      width: 100%;
      padding: ${asRem(10)} ${asRem(24)};

      @media screen and (min-width: ${Breakpoint.sm}) {
        width: auto;
      }
    }

  }

  .login-link {
    margin-top: ${asRem(32)};
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    .sibling-fields {
      flex-direction: row;
      >div:first-child {
        margin-right: ${asRem(10)};
      }
    }
  }

  .error-message {
    color: var(--color-error);
  }
`;

export const CreateAccountView = ({
  onSave,
  saving, saveError,
}) => {
  const fields = {
    ssn: {
      type: 'text',
      name: 'Kennitala',
      id: 'ssn',
      validateFn: Validate.all([
        Validate.required,
        Validate.ssn,
      ]),
    },
    email: {
      type: 'email',
      name: 'Netfang',
      id: 'email',
      validateFn: Validate.all([
        Validate.required,
        Validate.email,
      ]),
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
    password: {
      type: 'password',
      name: 'Lykilorð',
      id: 'password',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(4, 50),
      ]),
    },
    // repeatPassword: {
    //   type: 'password',
    //   name: 'Endurtaka lykilorð',
    //   id: 'repeatPassword',
    //   validateFn: Validate.all([
    //     Validate.required,
    //     Validate.lengthMinMax(4, 50),
    //   ]),
    // },
    subscribed: {
      type: 'checkbox',
      name: 'Skrá mig á póstlista',
      id: 'subscribed',
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

  const [formInitValue] = useState({
    ssn: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    // repeatPassword: 'Test123!',
    subscribed: true,
  });

  const buildSaveInput = (values) => {
    return {
      ssn: values.ssn ? applySSNMask(values.ssn) : '',
      email: values.email,
      firstname: values.firstname,
      lastname: values.lastname,
      password: values.password,
      // repeatPassword: values.repeatPassword,
      is_subscribed: values.subscribed,
    };
  };

  const onSubmit = (values) => {
    if (onSave) {
      onSave(buildSaveInput(values));
    }
  };

  return (
    <CreateAccountViewWrapper>
      <Row className="rz-page-content-inner">
        <Col className="page-section-main">
          <DisplayBold20 as="h1">Búa til aðgang</DisplayBold20>
          <FormWrapperStyle>
            <Formik
              initialValues={formInitValue}
              onSubmit={onSubmit}
              validateOnMount
            >
              {({ isValid }) => (
                <Form>
                  <Row className="sibling-fields">
                    <FormItem field={fields.firstname} />
                    <FormItem field={fields.lastname} />
                  </Row>
                  <div>
                    <FormItem field={fields.ssn} />
                  </div>
                  <div>
                    <FormItem field={fields.email} />
                  </div>
                  <div>
                    <FormItem field={fields.password} />
                  </div>
                  {/* <div>
                    <FormItem field={fields.repeatPassword} />
                  </div> */}
                  <div className="newsletter">
                    <FormItem field={fields.subscribed} />
                  </div>
                  <div className="terms-container">
                    <FormItem field={fields.termsAndConditions} />
                    <a href="/vidskiptaskilmalar" target="_blank" rel="noreferrer">
                      Samþykkja viðskiptaskilmála
                    </a>
                  </div>
                  <div className="error-message">
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
                      filled
                      className="button"
                      ariaLabel="Create Account"
                    >
                      <DisplayBold18 as="span">
                        Búa til aðgang
                      </DisplayBold18>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="login-link">
              Þegar með aðgang?
              {' '}
              <Link href="/customer/account/login/">
                <TextBold14 as="a" alt="Goto Login">Innskráning</TextBold14>
              </Link>
            </div>
          </FormWrapperStyle>
        </Col>
      </Row>
    </CreateAccountViewWrapper>
  );
};

CreateAccountView.propTypes = {
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
};
